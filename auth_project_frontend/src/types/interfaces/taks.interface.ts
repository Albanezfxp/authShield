import type { Situation } from "../enums/situation.enum";

export interface Task {
  id: string; // ✅ Obrigatório agora
  task_name: string;
  description: string;
  situation: Situation;
}
