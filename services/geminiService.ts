
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

  // Configuration initiale
  let modelName = 'gemini-3-flash-preview';
  let thinkingBudget = 0;

  if (mode === 'advanced' || mode === 'exam') {
    modelName = 'gemini-3-pro-preview';
    thinkingBudget = 4000;
  }

  // Règle de langue spécifique (Anglais + Traduction)
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

    DIRECTIVES DE LISIBILITÉ STRICTES :
    - AÈRE TON TEXTE AU MAXIMUM. 
    - SAUTE DEUX LIGNES entre chaque exercice, chaque grande section ou chaque point clé.
    - Utilise des listes à puces pour les énumérations.
    - Pour les mathématiques et les sciences, utilise le LaTeX pur ($...$ et $$...$$).

    DIRECTIVES DE RÉPONSE :
    1. SALUTATIONS : Si l'utilisateur dit "Bonjour", "Salut", "Hello" ou équivalent, RÉPONDS UNIQUEMENT par une salutation cordiale.
    2. CONCISION : Réponds précisément. Ne divague pas.
    3. MODES SPÉCIFIQUES :
       - Claire : Explications simples et directes.
       - Approfondir : Analyse complexe, détails techniques.
       - Exercices : Génère 5 exercices progressifs. SAUTE DES LIGNES ENTRE CHAQUE EXERCICE.
       - Examen : Fiche de révision structurée et synthétique.
  `;

  const buildContents = (modelToUse: string) => {
    const contents = history.map(msg => ({
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

    contents.push({
      role: 'user',
      parts: [{ text: `[MODE: ${mode}] [NIVEAU: ${level}] ${userInput}` }]
    });
    return contents;
  };

  const ai = new GoogleGenAI({AIzaSyDe9qCVrsfO7MV7le332QvoUIZIE0NUEo4});

  const attemptGeneration = async (currentModel: string, currentBudget: number): Promise<{ text: string; model: string }> => {
    const config: any = {
      systemInstruction: masterSystemInstruction,
      temperature: 0.2,
    };

    if (currentBudget > 0 && (currentModel.includes('pro') || currentModel.includes('2.5'))) {
      config.thinkingConfig = { thinkingBudget: currentBudget };
    }

    const response = await ai.models.generateContent({
      model: currentModel,
      contents: buildContents(currentModel),
      config: config,
    });

    if (response.text) {
      return { text: response.text, model: currentModel };
    }
    throw new Error("Réponse vide.");
  };

  try {
    // Tentative avec le modèle configuré (Pro ou Flash)
    return await attemptGeneration(modelName, thinkingBudget);
  } catch (error: any) {
    console.warn(`Échec avec ${modelName}, tentative de secours...`, error);
    
    // Si le mode Pro échoue, on bascule sur Flash (le plus puissant "illimité/gratuit")
    if (modelName === 'gemini-3-pro-preview') {
      try {
        return await attemptGeneration('gemini-3-flash-preview', 0);
      } catch (fallbackError) {
        throw new Error("Erreur service IA (Modèles saturés).");
      }
    }
    throw new Error("Erreur service IA.");
  }
};
