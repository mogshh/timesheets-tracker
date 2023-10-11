import './TagSelect.scss';

import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { DefaultService } from '../../generated/api/requests';
import type { TagName } from '../../types/types';

interface TagSelectProps {
  value: TagName | null;
  onChange: (newTagName: TagName | null) => void;
  autoFocus?: boolean;
}

function TagSelectSingle({ value, onChange, autoFocus }: TagSelectProps) {
  return (
    <AsyncCreatableSelect
      value={value}
      loadOptions={(searchTerm) => DefaultService.tagNamesControllerFindAll(searchTerm)}
      autoFocus={autoFocus ?? false}
      formatOptionLabel={(option: TagName) => option.name}
      placeholder="Tag selection..."
      isClearable
      isMulti={false}
      isSearchable
      onChange={(newValue) => onChange(newValue)}
      cacheOptions
      defaultOptions
    ></AsyncCreatableSelect>
  );
}

export default TagSelectSingle;
