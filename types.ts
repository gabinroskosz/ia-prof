
export type SubjectId = 'maths' | 'physique' | 'svt' | 'francais' | 'histoire' | 'anglais' | 'allemand' | 'snt' | 'ses';

export type ChatMode = 'clear' | 'advanced' | 'exercise' | 'exam';

export type ScolarityLevel = '6ème' | '5ème' | '4ème' | '3ème' | '2nde' | '1ère' | 'Terminale' | 'Post-Bac';

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  material: string[];
  method: {
    title: string;
    description: string;
  };
  webTips: string[];
  systemInstruction: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  images?: string[];
  modelName?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}
