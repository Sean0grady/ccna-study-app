export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  domain: string;
  objective: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
}
