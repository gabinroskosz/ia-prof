
import { GoogleGenAI } from "@google/genai";
import { Message, ChatMode, ScolarityLevel, SubjectId } from "../types";

export const generateSubjectStream = async (
  subjectId: SubjectId,
  subjectName: string,
  history: Message[],
  userInput: string,
  mode: ChatMode,
  level: ScolarityLevel,
  images?: string[]
) => {
  // Toujours utiliser process.env.API_KEY pour initialiser le client
  const ai = new GoogleGenAI({ apiKey: "AIzaSyDe9qCVrsfO7MV7le332QvoUIZIE0NUEo4" });

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
    - Utilise le LaTeX pur ($...$ et $$...$$) pour toute formule mathématique ou scientifique.

    DIRECTIVES DE RÉPONSE :
    1. SALUTATIONS : Si l'utilisateur salue uniquement, réponds par une salutation cordiale.
    2. CONCISION : Réponds précisément sans divaguer.
    3. MODES :
       - Claire : Simplicité et pédagogie.
       - Approfondir : Rigueur technique et détails poussés.
       - Exercices : Génère 5 exercices progressifs (saute 2 lignes entre chaque).
       - Examen : Fournis une synthèse complète et des conseils de révision.
    
    Réponds toujours de manière logique, en utilisant des exemples concrets pour faciliter l'assimilation.
  `;

  const contents: any[] = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [
      { text: msg.text || "" },
      ...(msg.images ? msg.images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.includes('base64,') ? img.split('base64,')[1] : img
        }
      })) : [])
    ]
  }));

  const lastMsg = history[history.length - 1];
  if (!lastMsg || lastMsg.text !== userInput) {
    contents.push({
      role: 'user',
      parts: [
        { text: `[MODE: ${mode}] [NIVEAU: ${level}] ${userInput}` },
        ...(images ? images.map(img => ({
          inlineData: {
            mimeType: "image/jpeg",
            data: img.includes('base64,') ? img.split('base64,')[1] : img
          }
        })) : [])
      ]
    });
  }

  const config = {
    systemInstruction: masterSystemInstruction,
    temperature: 0.7,
  };

  // Logique de sélection de modèle avec fallback (Pro -> Flash)
  const shouldUsePro = mode === 'exam' || mode === 'advanced';
  
  if (shouldUsePro) {
    try {
      // Tentative avec Gemini 3 Pro
      const proCall = ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents,
        config
      });

      // Timeout de 6 secondes pour éviter les attentes interminables (crédits épuisés, latence réseau, etc.)
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout Gemini 3 Pro")), 6000)
      );

      // On lance la course : le premier qui répond gagne
      const stream = await Promise.race([proCall, timeout]) as any;
      return { stream, modelUsed: 'Gemini 3 Pro' };
      
    } catch (error) {
      console.warn("Échec ou lenteur de Gemini 3 Pro, basculement sur Flash :", error);
      // En cas d'erreur (429, 500) ou de timeout, on laisse le code continuer vers le modèle Flash
    }
  }

  // Modèle par défaut (Flash) pour la rapidité ou en cas d'échec du Pro
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents,
    config
  });
  
  return { stream, modelUsed: 'Gemini 3 Flash' };
};
