import './TagSelect.scss';

import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { TagNamesService } from '../../generated/api/requests';
import type { TagName } from '../../types/types';
import { ActionMeta, OnChangeValue } from 'react-select/dist/declarations/src/types';

interface TagSelectProps {
  selectedValues?: TagName[];
  onChange: (
    option: OnChangeValue<TagName, true> | { label: string; value: string }[],
    actionMeta: ActionMeta<TagName>
  ) => void;
}

function TagSelectMulti({ selectedValues, onChange }: TagSelectProps) {
  return (
    <AsyncCreatableSelect
      value={selectedValues}
      loadOptions={(searchTerm) => TagNamesService.tagNamesControllerFindAll(searchTerm)}
      autoFocus={true}
      formatOptionLabel={(option: TagName) => option.name}
      placeholder="Tag selection..."
      isClearable
      isMulti
      isSearchable
      onChange={onChange}
    ></AsyncCreatableSelect>
  );
}

export default TagSelectMulti;
