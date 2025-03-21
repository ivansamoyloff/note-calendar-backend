export default interface IEvent {
  id: number;
  title: string;
  description?: string;
  meetLink?: string;
  location?: string;
  userId: number;
  startDate: string;
  endDate: string;
}
