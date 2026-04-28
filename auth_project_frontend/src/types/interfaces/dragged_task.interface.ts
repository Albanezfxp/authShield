import type { ColumnId } from "../type/colum_id.type";
import type { Task } from "./taks.interface";

export interface DraggedTask {
  task: Task;
  sourceColumn: ColumnId;
}
