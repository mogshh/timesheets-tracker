export interface Activity {
  id: string;
  programName: string;
  windowTitle: string;
  startedAt: string;
  endedAt: string;
}

export interface Website {
  id: string;
  websiteTitle: string;
  websiteUrl: string;
  startedAt: string;
  endedAt: string;
}

export interface ActiveState {
  id: string;
  isActive: boolean;
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

export interface AutoTag {
  id: string;
  name: string;
  tagNameId: string;
  priority: number;
  conditions: AutoTagCondition[];
  tagName?: TagName;
}

export interface AutoTagCondition {
  booleanOperator: BooleanOperator;
  variable: ConditionVariable | null;
  operator: ConditionOperator | null;
  value: string;
}

export enum BooleanOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum ConditionVariable {
  windowTitle = 'windowTitle',
  programName = 'programName',
  websiteTitle = 'websiteTitle',
  websiteUrl = 'websiteUrl',
}

export enum ConditionOperator {
  contains = 'contains',
  doesNotContains = 'doesNotContains',
  isExact = 'isExact',
  isNotExact = 'isNotExact',
  matchesRegex = 'matchesRegex',
  doesNotMatchRegex = 'doesNotMatchRegex',
}
