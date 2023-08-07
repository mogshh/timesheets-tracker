import './App.scss';

import React from 'react';
import Timeline from './components/Timeline/Timeline';
import { addHours, endOfDay, startOfDay, subHours } from 'date-fns';
import { TimelineEvent } from './components/Timeline/Timeline.types';
import { useDefaultServiceActivitiesControllerFindAll } from './generated/api/queries';
import { Activity } from '../../types/types';
import { COLOR_LIST } from './App.consts';
import { maxBy, minBy } from 'lodash-es';

function App() {
  const { data: programs, isLoading: isLoadingPrograms } = useDefaultServiceActivitiesControllerFindAll({
    startedAt: startOfDay(new Date()).toISOString(),
    endedAt: endOfDay(new Date()).toISOString(),
  });
  const events = (programs || []).map((program: Activity, programIndex: number): TimelineEvent => {
    return {
      info: {
        programName: program.programName,
        windowTitle: program.windowTitle,
      },
      color: COLOR_LIST[programIndex % COLOR_LIST.length],
      startedAt: new Date(program.startedAt),
      endedAt: new Date(program.endedAt),
    };
  });

  if (isLoadingPrograms) {
    return 'Loading program activity...';
  }

  const minTime = subHours(minBy(events, (event: TimelineEvent) => event.startedAt.getTime())?.startedAt || startOfDay(new Date()), 1);
  const maxTime = addHours(maxBy(events, (event: TimelineEvent) => event.endedAt.getTime())?.endedAt || endOfDay(new Date()), 1);
  return (
    <div className="c-app">
      <Timeline name="Tags" events={[]} minTime={minTime} maxTime={maxTime}></Timeline>
      <Timeline name="Auto tags" events={[]} minTime={minTime} maxTime={maxTime}></Timeline>
      <Timeline name="Active" events={[]} minTime={minTime} maxTime={maxTime}></Timeline>
      <Timeline name="Programs" events={events} minTime={minTime} maxTime={maxTime}></Timeline>
    </div>
  );
}

export default App;
