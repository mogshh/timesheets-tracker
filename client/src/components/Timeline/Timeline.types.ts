export interface TimelineEvent {
  id: string;
  info: Record<string, string>;
  color: string;
  startedAt: Date;
  endedAt: Date;
}
