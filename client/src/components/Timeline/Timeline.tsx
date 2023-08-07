import './Timeline.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { MouseEvent, useState } from 'react';
import { TimelineEvent } from './Timeline.types';
import { addHours, addMinutes, differenceInMilliseconds, endOfHour, format, isBefore, roundToNearestMinutes, addMilliseconds, differenceInSeconds } from 'date-fns';
import { clamp } from 'lodash-es';
import { formatDuration } from '../../helpers/format-duration';

interface TimelineProps {
  name: string;
  events: TimelineEvent[];
  minTime: Date;
  maxTime: Date;
}

function Timeline({ name, events, minTime, maxTime }: TimelineProps) {
  const [selectionStartPercent, setSelectionStartPercent] = useState<number | null>(null);
  const [selectionMovePercent, setSelectionMovePercent] = useState<number | null>(null);
  const [selectionEndPercent, setSelectionEndPercent] = useState<number | null>(null);

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
    console.log('mouse down ', posX);
    setSelectionStartPercent(clamp(posX, 0, 100));
    setSelectionEndPercent(null);
  };

  const handleMouseMove = (evt: MouseEvent) => {
    if (!selectionStartPercent) {
      // No selection started yet
      return;
    }
    if (selectionStartPercent && selectionEndPercent) {
      // Selection already ended
      return;
    }

    const posX = getMousePositionXPercent(evt);

    if (posX < 0 || posX > 100) {
      // Ignore impossible values
      return;
    }
    console.log('mouse move ', posX);
    setSelectionMovePercent(posX);
  };

  const handleMouseUp = (evt: MouseEvent) => {
    const posX = getMousePositionXPercent(evt);
    console.log('mouse up ', posX);
    if (posX === selectionStartPercent) {
      setSelectionStartPercent(null);
      setSelectionEndPercent(null);
    } else {
      setSelectionEndPercent(clamp(posX, 0, 100));
    }
  };

  const hourTicks = getTicks(minTime, maxTime, 60);
  const quarterTicks = getTicks(minTime, maxTime, 15);
  const selectionEndPercentageComputed = selectionEndPercent || selectionMovePercent;
  const selectionStartTime = addMilliseconds(minTime, (windowInMilliseconds / 100) * (selectionStartPercent || 0));
  const selectionEndTime = addMilliseconds(minTime, (windowInMilliseconds / 100) * (selectionEndPercentageComputed || 0));
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
        {!!selectionStartPercent && !!selectionEndPercentageComputed && (
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
            followCursor={!!selectionStartPercent && !selectionEndPercent ? 'horizontal' : false}
            placement="top-end"
          >
            <div className="c-timeline__selection" style={{ left: selectionStartPercent + '%', right: 100 - selectionEndPercentageComputed + '%' }}></div>
          </Tippy>
        )}
      </div>
    </div>
  );
}

export default Timeline;
