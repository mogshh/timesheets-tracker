import './Timeline.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { MouseEvent } from 'react';
import AsyncSelect from 'react-select/async';
import { TimelineEvent } from './Timeline.types';
import {
  addHours,
  addMinutes,
  differenceInMilliseconds,
  endOfHour,
  format,
  isBefore,
  roundToNearestMinutes,
  addMilliseconds,
  differenceInSeconds,
  isAfter,
} from 'date-fns';
import { formatDuration } from '../../helpers/format-duration';
import Modal from 'react-responsive-modal';
import { useDefaultServiceTagsControllerFindAll } from '../../generated/api/queries';

interface AddTagModalProps {
  startedAt: string;
  endedAt: string;
  isOpen: boolean;
}

function AddTagModal({ startedAt, endedAt, isOpen }: AddTagModalProps) {
  const { data: tags } = useDefaultServiceTagsControllerFindAll({ startedAt, endedAt });
  return <AsyncSelect isMulti loadOptions={loadOptions} options={}></AsyncSelect>;
}

export default AddTagModal;
