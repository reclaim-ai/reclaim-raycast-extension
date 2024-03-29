import { Task } from "../types/task";

export interface CreateTaskProps {
  title: string;
  timePolicy: string;
  category: string;
  timeNeeded: number;
  durationMin: number;
  durationMax: number;
  snoozeUntil: Date;
  due: Date;
  notes: string;
}

export type ApiResponseTasks = Task[];
