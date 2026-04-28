export const Situation = {
  TO_DO: "TO_DO",
  DONE: "DONE",
  IN_PROGRESS: "IN_PROGRESS",
} as const;

export type Situation = (typeof Situation)[keyof typeof Situation];
