export interface TimelineEvent {
  info: Record<string, string>;
  color: string;
  startedAt: Date;
  endedAt: Date;
}
