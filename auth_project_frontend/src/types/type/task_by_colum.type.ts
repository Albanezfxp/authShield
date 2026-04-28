import type { Task } from "../interfaces/taks.interface";
import type { ColumnId } from "./colum_id.type";

export type TasksByColumn = Record<ColumnId, Task[]>;
