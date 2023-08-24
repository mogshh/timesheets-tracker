export enum TimelineEventType {
  Activity = 'Activity',
  Tag = 'Tag',
  AutoTag = 'AutoTag',
}

export interface TimelineEvent {
  id: string;
  info: Record<string, string>;
  color: string;
  startedAt: Date;
  endedAt: Date;
  type: TimelineEventType;
}
