import { TimelineEvent, TimelineEventType } from '../components/Timeline/Timeline.types';
import { Activity, BooleanOperator, ConditionVariable } from '../../../types/types';
import { AutoTag, AutoTagCondition, ConditionOperator } from '../types/types';
import { compact } from 'lodash-es';

function splitConditionsOnOrOperators(conditions: AutoTagCondition[]): AutoTagCondition[][] {
  const groupedConditions: AutoTagCondition[][] = [];
  let currentGroup: AutoTagCondition[] = [];

  let currentIndex = 0;
  do {
    const currentCondition = conditions[currentIndex];
    currentGroup.push(currentCondition);
    if (currentCondition.booleanOperator === BooleanOperator.OR) {
      groupedConditions.push(currentGroup);
      currentGroup = [];
    }
    currentIndex++;
  } while (currentIndex < conditions.length);

  return groupedConditions;
}

function doesConditionMatch(activity: Activity, condition: AutoTagCondition): boolean {
  const toCheckValue = activity[condition.variable as ConditionVariable];
  switch (condition.operator) {
    case ConditionOperator.contains:
      return toCheckValue.toLowerCase().includes(condition.value.toLowerCase());
    case ConditionOperator.doesNotContains:
      return !toCheckValue.toLowerCase().includes(condition.value.toLowerCase());
    case ConditionOperator.isExact:
      return toCheckValue.toLowerCase() === condition.value.toLowerCase();
    case ConditionOperator.isNotExact:
      return toCheckValue.toLowerCase() !== condition.value.toLowerCase();
    case ConditionOperator.doesNotMatchRegex:
      return new RegExp(condition.value, 'g').test(toCheckValue);
    default:
      return false;
  }
}

function doesAutoTagMatch(autoTag: AutoTag, activity: Activity): boolean {
  const groupedConditions = splitConditionsOnOrOperators(autoTag.conditions);
  const matchedGroup = groupedConditions.find((groupedCondition) => {
    return groupedCondition.every((condition) => doesConditionMatch(activity, condition));
  });
  return !!matchedGroup;
}

export function calculateAutoTagEvents(
  programEvents: Activity[],
  autoTags: AutoTag[]
): TimelineEvent[] {
  const validAutoTags = autoTags.filter(
    (autoTag) => !!autoTag.tagName && autoTag.conditions?.length
  );
  const autoTagEvents = compact(
    programEvents.map((activity): TimelineEvent | null => {
      const autoTag = validAutoTags.find((autoTag) => doesAutoTagMatch(autoTag, activity));
      if (autoTag) {
        return {
          type: TimelineEventType.AutoTag,
          startedAt: new Date(activity.startedAt),
          endedAt: new Date(activity.endedAt),
          color: autoTag.tagName?.color || '',
          info: { tag: autoTag.tagName?.name || '', autoTagRule: autoTag.name },
        };
      } else {
        return null;
      }
    })
  );

  const combinedAutoTagEvents = compact([autoTagEvents[0]]);
  if (autoTagEvents.length) {
    // Combine auto tags that evaluate to the same tag name
    let index = 1;
    do {
      const lastCombinedAutoTagEvent = combinedAutoTagEvents.at(-1) as TimelineEvent;
      const currentAutoTagEvent = autoTagEvents[index];
      if (
        lastCombinedAutoTagEvent.info.tag === currentAutoTagEvent.info.tag &&
        new Date(currentAutoTagEvent.startedAt).getTime() -
          new Date(lastCombinedAutoTagEvent.endedAt).getTime() <
          5000
      ) {
        // Combine events
        lastCombinedAutoTagEvent.endedAt = currentAutoTagEvent.endedAt;
      } else {
        // Do not combine events
        combinedAutoTagEvents.push(currentAutoTagEvent);
      }
      index++;
    } while (index < autoTagEvents.length);
  }

  return combinedAutoTagEvents;
}
