import './Timeline.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { MouseEvent } from 'react';
import { TimelineEvent } from './Timeline.types';
import { addHours, addMinutes, differenceInMilliseconds, endOfHour, format, isBefore, roundToNearestMinutes, addMilliseconds, differenceInSeconds } from 'date-fns';
import { formatDuration } from '../../helpers/format-duration';

interface TimelineProps {
  name: string;
  events: TimelineEvent[];
  minTime: Date;
  maxTime: Date;
  onMouseDown: (posX: number) => void;
  onMouseMove: (posX: number) => void;
  onMouseUp: (posX: number) => void;
  selectionPercentages: { start: number; end: number } | null;
}

function Timeline({ name, events, minTime, maxTime, onMouseDown, onMouseMove, onMouseUp, selectionPercentages }: TimelineProps) {
  const windowInMilliseconds = differenceInMilliseconds(minTime, maxTime);

  /**
   * Returns all dates to place lines at. eg: every 60 minutes or every 15 minutes
   * @param minTime
   * @param maxTime
   * @param interval 30 or 15 or 5
   */
  const getTicks = (minTime: Date, maxTime: Date, interval: number) => {
    const ticks: Date[] = [];
    if (interval === 60) {
      let nextTick = endOfHour(minTime);

      while (isBefore(nextTick, maxTime)) {
        ticks.push(nextTick);
        nextTick = addHours(nextTick, 1);
      }
    } else {
      let nextTick = roundToNearestMinutes(minTime, { nearestTo: interval, roundingMethod: 'ceil' });

      while (isBefore(nextTick, maxTime)) {
        ticks.push(nextTick);
        nextTick = roundToNearestMinutes(addMinutes(nextTick, 1), { nearestTo: interval, roundingMethod: 'ceil' });
      }
    }

    return ticks;
  };

  const getMousePositionXPercent = (evt: MouseEvent) => {
    return ((evt.clientX - (evt.target as HTMLDivElement).offsetLeft) / (evt.target as HTMLDivElement).offsetWidth) * 100;
  };

  const handleMouseDown = (evt: MouseEvent) => {
    const posX = getMousePositionXPercent(evt);
    onMouseDown(posX);
  };

  const handleMouseMove = (evt: MouseEvent) => {
    const posX = getMousePositionXPercent(evt);

    if (posX < 0 || posX > 100) {
      // Ignore impossible values
      return;
    }
    onMouseMove(posX);
  };

  const handleMouseUp = (evt: MouseEvent) => {
    const posX = getMousePositionXPercent(evt);
    console.log('mouse up ', posX);
    onMouseUp(posX);
  };

  const hourTicks = getTicks(minTime, maxTime, 60);
  const quarterTicks = getTicks(minTime, maxTime, 15);
  const selectionStartTime = addMilliseconds(minTime, (windowInMilliseconds / 100) * (selectionPercentages?.start || 0));
  const selectionEndTime = addMilliseconds(minTime, (windowInMilliseconds / 100) * (selectionPercentages?.end || 0));
  return (
    <div className="c-timeline" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <div className="c-timeline__title">{name}</div>
      <div className="c-timeline__track">
        {/* Hour and quarter ticks */}
        {quarterTicks.map((quarterTick) => (
          <div
            key={'c-timeline__quarter-tick-' + quarterTick.toISOString()}
            className="c-timeline__quarter-tick"
            style={{ left: (differenceInMilliseconds(minTime, quarterTick) / windowInMilliseconds) * 100 + '%' }}
          ></div>
        ))}
        {hourTicks.map((hourTick) => (
          <div
            key={'c-timeline__hour-tick-' + hourTick.toISOString()}
            className="c-timeline__hour-tick"
            style={{ left: (differenceInMilliseconds(minTime, hourTick) / windowInMilliseconds) * 100 + '%' }}
          ></div>
        ))}

        {/* Events */}
        {events.map((event) => {
          const width = (differenceInMilliseconds(event.startedAt, event.endedAt) / windowInMilliseconds) * 100 + '%';

          return (
            <Tippy
              key={'c-timeline__event-' + event.startedAt.toISOString()}
              content={
                <ul className="c-timeline__event__tooltip">
                  <li>
                    <b>Date:</b> {format(event.startedAt, 'HH:mm:ss')} - {format(event.endedAt, 'HH:mm:ss')}
                  </li>
                  {Object.keys(event.info).map((key) => (
                    <li key={'event-info-' + event.startedAt.toISOString() + '-' + event.info[key]}>
                      <b>{key}</b>: {event.info[key]}
                    </li>
                  ))}
                </ul>
              }
            >
              <div
                className="c-timeline__event"
                style={{
                  left: (differenceInMilliseconds(minTime, event.startedAt) / windowInMilliseconds) * 100 + '%',
                  width,
                  backgroundColor: event.color,
                }}
              ></div>
            </Tippy>
          );
        })}

        {/* Selection */}
        {selectionPercentages && (
          <Tippy
            className="c-timeline__selection__tooltip--ended"
            content={
              <ul>
                <li>
                  {format(selectionStartTime, 'HH:mm:ss')} - {format(selectionEndTime, 'HH:mm:ss')}
                </li>
                <li>{formatDuration(differenceInSeconds(selectionStartTime, selectionEndTime))}</li>
              </ul>
            }
            visible
            followCursor={!!selectionPercentages.start && !selectionPercentages.end ? 'horizontal' : false}
            placement="top-end"
          >
            <div className="c-timeline__selection" style={{ left: selectionPercentages.start + '%', right: 100 - selectionPercentages.end + '%' }}></div>
          </Tippy>
        )}
      </div>
    </div>
  );
}

export default Timeline;
