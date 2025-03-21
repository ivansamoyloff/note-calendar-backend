export const TaskStatus = {
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  FINISHED: 'finished',
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
