import './TimelinesPage.scss';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import Timeline from '../../components/Timeline/Timeline';
import {
  addHours,
  addMilliseconds,
  differenceInMilliseconds,
  endOfDay,
  startOfDay,
  subHours,
} from 'date-fns';
import { TimelineEvent, TimelineType } from '../../components/Timeline/Timeline.types';
import {
  useActiveStatesServiceActiveStatesControllerFindAll,
  useActivitiesServiceActivitiesControllerFindAll,
  useAutoTagsServiceAutoTagsControllerFindAll,
  useTagNamesServiceTagNamesControllerCount,
  useTagNamesServiceTagNamesControllerCreate,
  useTagsServiceTagsControllerCreate,
  useTagsServiceTagsControllerFindAll,
  useTagsServiceTagsControllerRemove,
} from '../../generated/api/queries';
import type { ActiveState, Activity, AutoTag, Tag, TagName } from '../../types/types';
import { COLOR_LIST } from './TimelinesPage.consts';
import { clamp, maxBy, minBy } from 'lodash-es';
import { calculateAutoTagEvents } from '../../helpers/computeAutoTagEvents';
import { useAtom } from 'jotai/index';
import { viewDateAtom } from '../../store/store';

function TimelinesPage() {
  const [viewDate] = useAtom(viewDateAtom);

  const tagsResponse = useTagsServiceTagsControllerFindAll({
    startedAt: startOfDay(viewDate).toISOString(),
    endedAt: endOfDay(viewDate).toISOString(),
  });
  const {
    data: tags,
    isLoading: isLoadingTags,
    refetch: refetchTags,
  } = useTagsServiceTagsControllerFindAll({
    startedAt: startOfDay(viewDate).toISOString(),
    endedAt: endOfDay(viewDate).toISOString(),
  });
  const { data: programs, isLoading: isLoadingPrograms } =
    useActivitiesServiceActivitiesControllerFindAll({
      startedAt: startOfDay(viewDate).toISOString(),
      endedAt: endOfDay(viewDate).toISOString(),
    });
  const { data: activeStates, isLoading: isLoadingActiveStates } =
    useActiveStatesServiceActiveStatesControllerFindAll({
      startedAt: startOfDay(viewDate).toISOString(),
      endedAt: endOfDay(viewDate).toISOString(),
    });
  const {
    data: tagNamesCount,
    isLoading: isLoadingTagNamesCount,
    refetch: refetchTagNamesCount,
  } = useTagNamesServiceTagNamesControllerCount();
  const { data: allAutoTags, isLoading: isLoadingAllAutoTags } =
    useAutoTagsServiceAutoTagsControllerFindAll({ term: undefined });
  const { mutateAsync: deleteTag } = useTagsServiceTagsControllerRemove();
  const tagEvents = ((tags || []) as Tag[]).map((tag: Tag, tagIndex: number): TimelineEvent => {
    return {
      id: tag.id,
      info: {
        name: tag.tagName?.name as string,
      },
      color: tag.tagName?.color as string,
      startedAt: new Date(tag.startedAt),
      endedAt: new Date(tag.endedAt),
      type: TimelineType.Tag,
    };
  });
  const programEvents = (programs || []).map(
    (program: Activity, programIndex: number): TimelineEvent => {
      return {
        id: program.id,
        info: {
          programName: program.programName,
          windowTitle: program.windowTitle,
        },
        color: COLOR_LIST[programIndex % COLOR_LIST.length],
        startedAt: new Date(program.startedAt),
        endedAt: new Date(program.endedAt),
        type: TimelineType.Program,
      };
    }
  );
  const activeStateEvents = (activeStates || []).map(
    (activeState: ActiveState, activeStateIndex: number): TimelineEvent => {
      return {
        id: activeState.id,
        info: {
          state: String(activeState.isActive),
        },
        color: activeState.isActive ? '#00FF00' : '#FF0000',
        startedAt: new Date(activeState.startedAt),
        endedAt: new Date(activeState.endedAt),
        type: TimelineType.Program,
      };
    }
  );
  const [autoTagEvents, setAutoTagEvents] = useState<TimelineEvent[]>([]);

  const { mutateAsync: createTagName } = useTagNamesServiceTagNamesControllerCreate();
  const { mutateAsync: createTag } = useTagsServiceTagsControllerCreate();

  const [selectionStartPercent, setSelectionStartPercent] = useState<number | null>(null);
  const [selectionMovePercent, setSelectionMovePercent] = useState<number | null>(null);
  const [selectionEndPercent, setSelectionEndPercent] = useState<number | null>(null);
  const [activeSelectionTimeline, setActiveSelectionTimeline] = useState<string | null>(null);

  const [selectedTimeline, setSelectedTimeline] = useState<TimelineType>(TimelineType.Programs);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const minTime = subHours(
    minBy(programEvents, (event: TimelineEvent) => event.startedAt.getTime())?.startedAt ||
      startOfDay(new Date()),
    1
  );
  const maxTime = addHours(
    maxBy(programEvents, (event: TimelineEvent) => event.endedAt.getTime())?.endedAt ||
      endOfDay(new Date()),
    1
  );
  const windowInMilliseconds = differenceInMilliseconds(maxTime, minTime);
  const selectionStartTime = addMilliseconds(
    minTime,
    (windowInMilliseconds / 100) * (selectionStartPercent || 0)
  );
  const selectionEndTime = addMilliseconds(
    minTime,
    (windowInMilliseconds / 100) * (selectionEndPercent || 0)
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUpEvent);

    return () => {
      document.removeEventListener('keyup', handleKeyUpEvent);
    };
  }, []);

  useEffect(() => {
    if (!isLoadingPrograms && !isLoadingAllAutoTags && !!programs && !!allAutoTags) {
      setAutoTagEvents(calculateAutoTagEvents(programs as Activity[], allAutoTags as AutoTag[]));
    }
  }, [isLoadingPrograms, isLoadingAllAutoTags, allAutoTags, programs]);

  const handleKeyUpEvent = async (evt: KeyboardEvent) => {
    // Use state setter function to get latest state, since this event handler happens outside the react
    setSelectedEvent((oldSelectedEvent) => {
      if (evt.key === 'Delete') {
        // Delete selected event
        if (oldSelectedEvent?.id && oldSelectedEvent?.type === TimelineType.Tag) {
          (async () => {
            await deleteTag({
              id: oldSelectedEvent.id as string,
            });
            await refetchTags();
            toast('Tag was deleted', { type: 'success' });
          })();
        } else {
          toast('No tag was selected', { type: 'warning' });
        }
      }
      return null;
    });
  };

  const handleMouseDown = (timelineId: string, posX: number) => {
    setSelectionStartPercent(clamp(posX, 0, 100));
    setSelectionMovePercent(null);
    setSelectionEndPercent(null);
    setActiveSelectionTimeline(timelineId);
  };

  const handleMouseMove = (timelineId: string, posX: number) => {
    if (!selectionStartPercent) {
      // No selection started yet
      return;
    }
    if (selectionStartPercent && selectionEndPercent) {
      // Selection already ended
      return;
    }
    setSelectionMovePercent(posX);
  };

  const handleMouseUp = (timelineId: string, posX: number) => {
    if (posX === selectionStartPercent) {
      setSelectionStartPercent(null);
      setSelectionEndPercent(null);
      setActiveSelectionTimeline(null);
      setSelectedEvent(null);
    } else {
      setSelectionEndPercent(clamp(posX, 0, 100));
    }
  };

  const handleCreateTagName = async (name: string): Promise<TagName> => {
    return createTagName({
      requestBody: {
        name,
        color: COLOR_LIST[(tagNamesCount || 0) % COLOR_LIST.length], // Get a new color that hasn't been recently used
      },
    }) as Promise<TagName>;
  };

  const handleCreateTag = async (tagNameId: string): Promise<void> => {
    await createTag({
      requestBody: {
        tagNameId,
        startedAt: selectionStartTime.toISOString(),
        endedAt: selectionEndTime.toISOString(),
      },
    });
    await Promise.all([refetchTags(), refetchTagNamesCount()]);
  };

  if (isLoadingPrograms) {
    return <>Loading program activity...</>;
  }
  if (isLoadingTags) {
    return <>Loading program activity...</>;
  }
  const selection =
    selectionStartPercent && (selectionEndPercent || selectionMovePercent)
      ? {
          start: Math.min(
            selectionStartPercent,
            (selectionEndPercent || selectionMovePercent) as number
          ),
          end: Math.max(
            selectionStartPercent,
            (selectionEndPercent || selectionMovePercent) as number
          ),
        }
      : null;
  return (
    <div className="c-app">
      <div>
        <Timeline
          name="Tags"
          events={tagEvents}
          minTime={minTime}
          maxTime={maxTime}
          onMouseDown={(posX: number) => handleMouseDown(TimelineType.Tag, posX)}
          onMouseMove={(posX: number) => handleMouseMove(TimelineType.Tag, posX)}
          onMouseUp={(posX: number) => handleMouseUp(TimelineType.Tag, posX)}
          selectionPercentages={activeSelectionTimeline === TimelineType.Tag ? selection : null}
          onCreateTagName={handleCreateTagName}
          onCreateTag={handleCreateTag}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        ></Timeline>
        <Timeline
          name="Auto tags"
          events={autoTagEvents}
          minTime={minTime}
          maxTime={maxTime}
          onMouseDown={(posX: number) => handleMouseDown(TimelineType.AutoTag, posX)}
          onMouseMove={(posX: number) => handleMouseMove(TimelineType.AutoTag, posX)}
          onMouseUp={(posX: number) => handleMouseUp(TimelineType.AutoTag, posX)}
          selectionPercentages={activeSelectionTimeline === TimelineType.AutoTag ? selection : null}
          onCreateTagName={handleCreateTagName}
          onCreateTag={handleCreateTag}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        ></Timeline>
        <Timeline
          name="Active"
          events={activeStateEvents}
          minTime={minTime}
          maxTime={maxTime}
          onMouseDown={(posX: number) => handleMouseDown(TimelineType.Active, posX)}
          onMouseMove={(posX: number) => handleMouseMove(TimelineType.Active, posX)}
          onMouseUp={(posX: number) => handleMouseUp(TimelineType.Active, posX)}
          selectionPercentages={activeSelectionTimeline === TimelineType.Active ? selection : null}
          onCreateTagName={handleCreateTagName}
          onCreateTag={handleCreateTag}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        ></Timeline>
        <Timeline
          name="Programs"
          events={programEvents}
          minTime={minTime}
          maxTime={maxTime}
          onMouseDown={(posX: number) => handleMouseDown(TimelineType.Program, posX)}
          onMouseMove={(posX: number) => handleMouseMove(TimelineType.Program, posX)}
          onMouseUp={(posX: number) => handleMouseUp(TimelineType.Program, posX)}
          selectionPercentages={activeSelectionTimeline === TimelineType.Program ? selection : null}
          onCreateTagName={handleCreateTagName}
          onCreateTag={handleCreateTag}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        ></Timeline>
      </div>
      <div>
        {}
        <div></div>
      </div>
    </div>
  );
}

export default TimelinesPage;
