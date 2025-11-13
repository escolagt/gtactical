// src/types/course.ts

// Nível dos cursos exibidos na UI
export type CourseLevel = "Iniciante" | "Modular" | "Tático" | "Avançado";

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  objectives: string[];
  methodology: string;
  outcome: string;
  duration: string;
  modelSrc?: string;
  posterSrc: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
}

export interface Lead {
  curso: string;
  turma: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  observacoes?: string;
  aceitoTermos: boolean;
  aceitoGravacao: boolean;
  timestamp?: string;
}
