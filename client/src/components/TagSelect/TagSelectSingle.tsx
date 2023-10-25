import './TagSelect.scss';

import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { TagNamesService } from '../../generated/api/requests';
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
      getOptionValue={(value) => value.id}
      loadOptions={(searchTerm) =>
        TagNamesService.tagNamesControllerFindAll(searchTerm) as Promise<TagName[]>
      }
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
