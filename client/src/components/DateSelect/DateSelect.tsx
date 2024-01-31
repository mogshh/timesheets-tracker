import './DateSelect.scss';

import React from 'react';
import { useAtom } from 'jotai';
import { viewDateAtom } from '../../store/store';
import { addDays, format, parseISO } from 'date-fns';

interface DateSelectProps {}

function DateSelect({}: DateSelectProps) {
  const [viewDate, setViewDate] = useAtom(viewDateAtom);

  return (
    <div className="c-date-select">
      <button className="c-button" onClick={() => setViewDate(new Date())}>
        TODAY
      </button>
      <button className="c-button" onClick={() => setViewDate((prevDate) => addDays(prevDate, -1))}>
        -
      </button>
      <span>{format(viewDate, 'eee')}</span>
      <input
        type="date"
        value={format(viewDate, 'yyyy-MM-dd')}
        onChange={(evt) => setViewDate(parseISO(evt.target.value))}
      />
      <button className="c-button" onClick={() => setViewDate((prevDate) => addDays(prevDate, 1))}>
        +
      </button>
    </div>
  );
}

export default DateSelect;
