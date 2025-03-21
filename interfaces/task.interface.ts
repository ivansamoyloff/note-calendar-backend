import { TaskStatusType } from './taskStatus.type';
export default interface ITask {
  id: number;
  title: string;
  description?: string;
  status?: TaskStatusType;
  userId: number;
  startDate: string;
  endDate: string;
}
