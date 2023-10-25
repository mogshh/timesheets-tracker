import './Timeline.scss';

import 'tippy.js/dist/tippy.css';
import React from 'react';
import AsyncSelect from 'react-select/async';
import { useTagsServiceTagsControllerFindAll } from '../../generated/api/queries';

interface AddTagModalProps {
  startedAt: string;
  endedAt: string;
  isOpen: boolean;
}

function AddTagModal({ startedAt, endedAt, isOpen }: AddTagModalProps) {
  const { data: tags } = useTagsServiceTagsControllerFindAll({ startedAt, endedAt });
  // return <AsyncSelect isMulti loadOptions={loadOptions} options={}></AsyncSelect>;
}

export default AddTagModal;
