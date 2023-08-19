import './App.scss';

import React, { useState } from 'react';
import Timeline from './components/Timeline/Timeline';
import { addHours, endOfDay, startOfDay, subHours } from 'date-fns';
import { TimelineEvent } from './components/Timeline/Timeline.types';
import {
  useDefaultServiceActivitiesControllerFindAll,
  useDefaultServiceTagsControllerCreate,
  useDefaultServiceTagsControllerFindAll,
} from './generated/api/queries';
import { Activity, Tag } from '../../types/types';
import { COLOR_LIST } from './App.consts';
import { clamp, maxBy, minBy } from 'lodash-es';

function App() {
  const { data: tags, isLoading: isLoadingTags } = useDefaultServiceTagsControllerFindAll({
    startedAt: startOfDay(new Date()).toISOString(),
    endedAt: endOfDay(new Date()).toISOString(),
  });
  const { data: programs, isLoading: isLoadingPrograms } =
    useDefaultServiceActivitiesControllerFindAll({
      startedAt: startOfDay(new Date()).toISOString(),
      endedAt: endOfDay(new Date()).toISOString(),
    });
  const tagEvents = (tags || []).map((tag: Tag, tagIndex: number): TimelineEvent => {
    return {
      info: {
        name: tag.tagName?.name as string,
      },
      color: tag.tagName?.color as string,
      startedAt: new Date(tag.startedAt),
      endedAt: new Date(tag.endedAt),
    };
  });
  const programEvents = (programs || []).map(
    (program: Activity, programIndex: number): TimelineEvent => {
      return {
        info: {
          programName: program.programName,
          windowTitle: program.windowTitle,
        },
        color: COLOR_LIST[programIndex % COLOR_LIST.length],
        startedAt: new Date(program.startedAt),
        endedAt: new Date(program.endedAt),
      };
    }
  );

  const [selectionStartPercent, setSelectionStartPercent] = useState<number | null>(null);
  const [selectionMovePercent, setSelectionMovePercent] = useState<number | null>(null);
  const [selectionEndPercent, setSelectionEndPercent] = useState<number | null>(null);
  const [activeSelectionTimeline, setActiveSelectionTimeline] = useState<string | null>(null);

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
    } else {
      setSelectionEndPercent(clamp(posX, 0, 100));
    }
  };

  if (isLoadingPrograms) {
    return <>Loading program activity...</>;
  }

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
      <Timeline
        name="Tags"
        events={tagEvents}
        minTime={minTime}
        maxTime={maxTime}
        onMouseDown={(posX: number) => handleMouseDown('tags', posX)}
        onMouseMove={(posX: number) => handleMouseMove('tags', posX)}
        onMouseUp={(posX: number) => handleMouseUp('tags', posX)}
        selectionPercentages={activeSelectionTimeline === 'tags' ? selection : null}
      ></Timeline>
      <Timeline
        name="Auto tags"
        events={[]}
        minTime={minTime}
        maxTime={maxTime}
        onMouseDown={(posX: number) => handleMouseDown('autoTags', posX)}
        onMouseMove={(posX: number) => handleMouseMove('autoTags', posX)}
        onMouseUp={(posX: number) => handleMouseUp('autoTags', posX)}
        selectionPercentages={activeSelectionTimeline === 'autoTags' ? selection : null}
      ></Timeline>
      <Timeline
        name="Active"
        events={[]}
        minTime={minTime}
        maxTime={maxTime}
        onMouseDown={(posX: number) => handleMouseDown('active', posX)}
        onMouseMove={(posX: number) => handleMouseMove('active', posX)}
        onMouseUp={(posX: number) => handleMouseUp('active', posX)}
        selectionPercentages={activeSelectionTimeline === 'active' ? selection : null}
      ></Timeline>
      <Timeline
        name="Programs"
        events={programEvents}
        minTime={minTime}
        maxTime={maxTime}
        onMouseDown={(posX: number) => handleMouseDown('programs', posX)}
        onMouseMove={(posX: number) => handleMouseMove('programs', posX)}
        onMouseUp={(posX: number) => handleMouseUp('programs', posX)}
        selectionPercentages={activeSelectionTimeline === 'programs' ? selection : null}
      ></Timeline>
    </div>
  );
}

export default App;
