
import { GoogleGenAI } from "@google/genai";
import { Message, ChatMode, ScolarityLevel, SubjectId } from "../types";

export const generateSubjectResponse = async (
  subjectId: SubjectId,
  subjectName: string,
  history: Message[],
  userInput: string,
  mode: ChatMode,
  level: ScolarityLevel,
  images?: string[]
): Promise<{ text: string; model: string }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Clé API manquante.");

  // Configuration du modèle en fonction du mode
  let modelName = 'gemini-3-flash-preview';
  let thinkingBudget = 0;

  if (mode === 'advanced' || mode === 'exam') {
    modelName = 'gemini-3-pro-preview';
    thinkingBudget = 4000;
  }

  // Règle de langue spécifique
  let languageInstruction = "";
  if (subjectId === 'anglais') {
    languageInstruction = `
      TU ES UN PROFESSEUR D'ANGLAIS.
      RÈGLE DE LANGUE : Écris tes phrases en ANGLAIS, suivies de leur traduction en FRANÇAIS entre parenthèses.
      EXCEPTION : En mode 'Exercices', ne donne PAS de traduction pour les questions.
    `;
  } else {
    languageInstruction = "Tu t'exprimes EXCLUSIVEMENT en Français, de manière claire et structurée.";
  }

  const masterSystemInstruction = `
    ${languageInstruction}
    DISCIPLINE : ${subjectName}.
    NIVEAU : ${level}.

    DIRECTIVES DE LISIBILITÉ :
    - AÈRE TON TEXTE. SAUTE DES LIGNES entre chaque section.
    - Utilise des listes à puces pour les énumérations.
    - Utilise le LaTeX pur ($...$ et $$...$$).

    DIRECTIVES DE RÉPONSE :
    1. SALUTATIONS : Si l'utilisateur salue uniquement, réponds par une salutation cordiale.
    2. CONCISION : Réponds précisément sans divaguer.
    3. MODES :
       - Claire : Simplicité.
       - Approfondir : Rigueur technique.
       - Exercices : 5 exercices progressifs (saute 2 lignes entre chaque).
       - Examen : Synthèse complète.
  `;

  // Construction des contenus pour l'API
  // Important : 'history' passé par ChatInterface contient déjà le message actuel de l'utilisateur.
  // Pour éviter la duplication [user, user] qui cause une erreur 400, on prend l'historique passé
  // mais on recrée proprement le dernier tour pour inclure les tags de contexte.
  
  // On filtre l'historique pour ne garder que les tours complets précédents
  const previousTurns = history.slice(0, -1);
  const contents = previousTurns.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [
      { text: msg.text },
      ...(msg.images ? msg.images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1] || img
        }
      })) : [])
    ]
  }));

  // On ajoute le message actuel (le dernier de 'history') avec les métadonnées
  contents.push({
    role: 'user',
    parts: [
      { text: `[MODE: ${mode}] [NIVEAU: ${level}] ${userInput}` },
      ...(images ? images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1] || img
        }
      })) : [])
    ]
  });

  // Initialisation de l'API avec la clé d'environnement
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const attemptGeneration = async (currentModel: string, currentBudget: number): Promise<{ text: string; model: string }> => {
    const config: any = {
      systemInstruction: masterSystemInstruction,
      temperature: 0.2,
    };

    // Application du budget de réflexion pour les modèles compatibles
    if (currentBudget > 0 && (currentModel.includes('pro') || currentModel.includes('3'))) {
      config.thinkingConfig = { thinkingBudget: currentBudget };
    }

    const response = await ai.models.generateContent({
      model: currentModel,
      contents,
      config,
    });

    if (response.text) {
      return { text: response.text, model: currentModel };
    }
    throw new Error("Réponse vide de l'API.");
  };

  try {
    return await attemptGeneration(modelName, thinkingBudget);
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Stratégie de secours : si le modèle Pro échoue, on tente le modèle Flash
    if (modelName === 'gemini-3-pro-preview') {
      try {
        return await attemptGeneration('gemini-3-flash-preview', 0);
      } catch (fallbackError) {
        throw new Error("Les serveurs de l'IA sont surchargés. Réessayez dans un instant.");
      }
    }
    throw new Error("Échec de la connexion à l'IA. Vérifiez votre clé API ou votre connexion.");
  }
};
