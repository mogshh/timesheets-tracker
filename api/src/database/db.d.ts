export interface ActiveStates {
  id: string;
  isActive: number | null;
  startedAt: string;
  endedAt: string;
}

export interface Activities {
  id: string;
  programName: string | null;
  windowTitle: string | null;
  startedAt: string;
  endedAt: string;
}

export interface AutoTags {
  id: string;
  name: string;
  tagNameId: string;
  priority: string;
  conditions: string;
}

export interface TagNames {
  id: string;
  name: string;
  color: string;
}

export interface Tags {
  id: string;
  tagNameId: string;
  startedAt: string;
  endedAt: string;
}

export interface DB {
  activeStates: ActiveStates;
  activities: Activities;
  autoTags: AutoTags;
  tagNames: TagNames;
  tags: Tags;
}
