export interface Activity {
  id: string;
  programName: string;
  windowTitle: string;
  startedAt: string;
  endedAt: string;
}

export interface Tag {
  id: string;
  tagNameId: string;
  startedAt: string;
  endedAt: string;
  tagName?: TagName;
}

export interface TagName {
  id: string;
  name: string;
  color: string;
}
