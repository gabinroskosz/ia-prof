
import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'maths',
    name: 'Mathématiques',
    icon: '📐',
    color: 'blue',
    material: [
      "Calculatrice TI/Casio (Mode Examen)",
      "Feuilles petits carreaux",
      "Logiciel GeoGebra",
      "Stylo vert pour la correction"
    ],
    method: {
      title: 'Active Recall & 3 Colonnes',
      description: "1. Écris toutes les formules de mémoire.\n2. Énoncé / Essai / Correction (stylo vert).\n3. Note tes erreurs types."
    },
    webTips: [
      "Yvan Monka (YouTube) pour les démonstrations.",
      "Vérifie la cohérence de tes unités."
    ],
    systemInstruction: "Mathématiques"
  },
  {
    id: 'physique',
    name: 'Physique-Chimie',
    icon: '🧪',
    color: 'purple',
    material: [
      "Tableau périodique",
      "Calculatrice scientifique",
      "Surligneurs"
    ],
    method: {
      title: 'Logic-First',
      description: "1. Visualise le phénomène physique.\n2. Pose tes données et unités.\n3. Vérifie l'ordre de grandeur."
    },
    webTips: [
      "Simulations PhET pour visualiser.",
      "Maitrise les puissances de 10."
    ],
    systemInstruction: "Sciences Physiques"
  },
  {
    id: 'svt',
    name: 'SVT',
    icon: '🌿',
    color: 'green',
    material: [
      "Crayons de couleur",
      "Lexique scientifique",
      "Accès Lumni"
    ],
    method: {
      title: 'Schéma-Bilan Mental',
      description: "1. Apprends avec des schémas fléchés.\n2. Explique le mécanisme à voix haute.\n3. Vocabulaire précis exigé."
    },
    webTips: [
      "Animations Corpus (Canopé).",
      "Analyse de doc : Je vois / Or je sais / Donc."
    ],
    systemInstruction: "SVT"
  },
  {
    id: 'francais',
    name: 'Français',
    icon: '📖',
    color: 'orange',
    material: [
      "Bescherelle",
      "Dictionnaire de synonymes",
      "Fiches de citations"
    ],
    method: {
      title: 'Critique Active (TIC)',
      description: "Thème / Illustration / Commentaire. Analyse le texte avec précision."
    },
    webTips: [
      "Projet Voltaire pour l'orthographe.",
      "Podcasts France Culture."
    ],
    systemInstruction: "Lettres et Français"
  },
  {
    id: 'histoire',
    name: 'Histoire-Géo',
    icon: '🌍',
    color: 'amber',
    material: [
      "Atlas géographique",
      "Feutres de cartographie",
      "Anki"
    ],
    method: {
      title: 'Chrono-Logic',
      description: "1. Chaînes de causes/conséquences.\n2. Sketch-mapping pour les cartes.\n3. Dates clés en flashcards."
    },
    webTips: [
      "Le Dessous des Cartes (YouTube).",
      "Liens avec l'actualité."
    ],
    systemInstruction: "Histoire-Géographie"
  },
  {
    id: 'ses',
    name: 'SES',
    icon: '📈',
    color: 'rose',
    material: [
      "Lexique spécialisé",
      "Actualité économique"
    ],
    method: {
      title: 'Méthode AEI',
      description: "Affirmer / Expliquer / Illustrer. Maîtrise les mécanismes sociaux et économiques."
    },
    webTips: [
      "Dessine-moi l'éco pour les mécanismes.",
      "Vérifie tes sources statistiques."
    ],
    systemInstruction: "SES"
  },
  {
    id: 'anglais',
    name: 'Anglais',
    icon: '🇬🇧',
    color: 'red',
    material: [
      "Carnet de Chunks",
      "Netflix VOST",
      "Reverso Context"
    ],
    method: {
      title: 'Immersion & Shadowing',
      description: "1. Apprends par blocs (Chunks).\n2. Imite la prononciation.\n3. Note 5 nouveaux mots."
    },
    webTips: [
      "BBC Learning English.",
      "Pense directement en anglais."
    ],
    systemInstruction: "Anglais"
  },
  {
    id: 'allemand',
    name: 'Allemand',
    icon: '🇩🇪',
    color: 'yellow',
    material: [
      "Tableau des déclinaisons",
      "Verbes forts"
    ],
    method: {
      title: 'Lego-Syntax',
      description: "1. Place du verbe (V2).\n2. Code couleur genres.\n3. Prépositions en chantant."
    },
    webTips: [
      "Deutsche Welle (DW).",
      "Pratique la syntaxe quotidiennement."
    ],
    systemInstruction: "Allemand"
  },
  {
    id: 'snt',
    name: 'SNT / NSI',
    icon: '💻',
    color: 'slate',
    material: [
      "Ordinateur (Python)",
      "VS Code",
      "Algorithmes"
    ],
    method: {
      title: 'Debugging Active',
      description: "1. Explique ton code au canard.\n2. Ne copie pas, réécris.\n3. Teste les limites."
    },
    webTips: [
      "France-IOI pour les défis.",
      "Doc Python officielle."
    ],
    systemInstruction: "Informatique / NSI"
  }
];
