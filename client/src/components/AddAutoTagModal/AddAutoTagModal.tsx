import './AddAutoTagModal.scss';

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import AutoTagConditionInput from '../AutoTagCondition/AutoTagConditionInput';
import { cloneDeep } from 'lodash-es';
import TagSelectSingle from '../TagSelect/TagSelectSingle';
import {
  AutoTagCondition,
  BooleanOperator,
  ConditionOperator,
  ConditionVariable,
  TagName,
} from '../../../../types/types';

interface AddAutoTagProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEW_CONDITION = {
  booleanOperator: BooleanOperator.OR,
  variable: ConditionVariable.windowTitle,
  operator: ConditionOperator.contains,
  value: '',
};

function AddAutoTagModal({ isOpen, onClose }: AddAutoTagProps) {
  const [tagName, setTagName] = useState<TagName | null>(null);
  const [conditions, setConditions] = useState<AutoTagCondition[]>([NEW_CONDITION, NEW_CONDITION]);

  useEffect(() => {
    const lastCondition = conditions.at(-1);
    if (!lastCondition) {
      return;
    }
    if (lastCondition.variable && lastCondition.operator && lastCondition.value) {
      setConditions([...conditions, { ...NEW_CONDITION }]);
    }
  }, [conditions]);

  const handleChangeCondition = (
    i: number,
    booleanOperator: BooleanOperator,
    variable: ConditionVariable | null,
    operator: ConditionOperator | null,
    value: string
  ) => {
    const newConditions = cloneDeep(conditions);
    newConditions[i] = {
      booleanOperator,
      variable,
      operator,
      value,
    };
    setConditions(newConditions);
  };

  const handleDeleteCondition = (conditionIndex: number) => {
    const newConditions = cloneDeep(conditions);
    newConditions.splice(conditionIndex, 1);
    setConditions(newConditions);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      classNames={{ modal: 'c-add-auto-tag-modal', closeButton: 'c-button c-button--small' }}
    >
      <h3>Add auto tag</h3>
      <h4>Tag</h4>
      <TagSelectSingle value={tagName} onChange={setTagName} autoFocus={true} />
      <h4>Conditions</h4>
      <div>
        {conditions.map((condition, i) => (
          <AutoTagConditionInput
            key={'auto-tag-condition__' + i}
            index={i}
            showBooleanOperator={i !== 0}
            {...conditions[i]}
            onChange={(booleanOperator, variable, operator, value) =>
              handleChangeCondition(i, booleanOperator, variable, operator, value)
            }
            onDelete={handleDeleteCondition}
          ></AutoTagConditionInput>
        ))}
      </div>
    </Modal>
  );
}

export default AddAutoTagModal;
