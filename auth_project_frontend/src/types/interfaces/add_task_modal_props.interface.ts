import type { FormEvent } from "react";

export interface AddTaskModalProps {
  setShowModal: (p: boolean) => void;
  handleAddTask: (e: FormEvent<HTMLFormElement>) => void;
  newTask: {
    task_name: string;
    description: string;
  };
  setNewTask: (task: { task_name: string; description: string }) => void;
}
