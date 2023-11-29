import './EditAutoTagModal.scss';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import AutoTagConditionInput from '../AutoTagCondition/AutoTagConditionInput';
import { cloneDeep } from 'lodash-es';
import TagSelectSingle from '../TagSelect/TagSelectSingle';
import {
  AutoTag,
  AutoTagCondition,
  BooleanOperator,
  ConditionOperator,
  ConditionVariable,
  TagName,
} from '../../types/types';
import ToggleButton from '../ToggleButton/ToggleButton';
import {
  useAutoTagsServiceAutoTagsControllerCreate,
  useAutoTagsServiceAutoTagsControllerFindOne,
  useAutoTagsServiceAutoTagsControllerFindOneKey,
} from '../../generated/api/queries';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PARTS } from '../../App';
import { AutoTagConditionDto } from '../../generated/api/requests';

const NEW_CONDITION = {
  booleanOperator: BooleanOperator.OR,
  variable: ConditionVariable.windowTitle,
  operator: ConditionOperator.contains,
  value: '',
};

function EditAutoTagModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [tagName, setTagName] = useState<TagName | null>(null);
  const [priority, setPriority] = useState<number>(0); // TODO allow drag and drop
  const [conditions, setConditions] = useState<AutoTagCondition[]>([NEW_CONDITION, NEW_CONDITION]);
  const [showCreateNewTagControls, setShowCreateNewTagControls] = useState<boolean>(false);
  const [createTagName, setCreateTagName] = useState<string>('');
  const { data: autoTagResponse } = useAutoTagsServiceAutoTagsControllerFindOne(
    { id: id as string },
    [useAutoTagsServiceAutoTagsControllerFindOneKey, id as string],
    { enabled: !!id }
  );
  const autoTag = autoTagResponse as AutoTag;
  const { mutateAsync: createAutoTag } = useAutoTagsServiceAutoTagsControllerCreate();

  useEffect(() => {
    if (autoTag) {
      setName(autoTag.name);
      if (autoTag.tagName) {
        setTagName(autoTag.tagName);
      }
      setPriority(autoTag.priority);
      if (autoTag.conditions?.length !== 0) {
        setConditions(autoTag.conditions);
      }
    }
  }, [autoTag]);

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

  const handleClose = () => navigate('/' + ROUTE_PARTS.autoTagRules);

  const handleSave = async (autoTag: Omit<AutoTag, 'id'>) => {
    await createAutoTag({
      requestBody: {
        name: autoTag.name,
        priority: autoTag.priority,
        tagNameId: autoTag.tagNameId,
        conditions: autoTag.conditions as unknown as AutoTagConditionDto[],
      },
    });
    handleClose();
  };

  return (
    <Modal
      open
      onClose={handleClose}
      classNames={{ modal: 'c-add-auto-tag-modal', closeButton: 'c-button c-button--small' }}
    >
      <h3>Add auto tag</h3>
      <label>Auto tag Name</label>
      <input
        className="c-input"
        value={name}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => setName(evt.target?.value)}
      />

      <label>Activity Tag</label>
      <ToggleButton
        optionTwoSelected={false}
        onChange={setShowCreateNewTagControls}
        label1="Existing tag"
        label2="Create new tag"
      ></ToggleButton>
      {!showCreateNewTagControls && (
        <TagSelectSingle value={tagName || null} onChange={setTagName} autoFocus={true} />
      )}
      {showCreateNewTagControls && (
        <div>
          <input
            className="c-input"
            value={createTagName}
            onChange={(evt) => setCreateTagName(evt.target.value)}
          />
        </div>
      )}

      <label>Conditions</label>
      <div>
        {!!conditions &&
          conditions.map((condition, i) => (
            <AutoTagConditionInput
              key={'auto-tag-condition__' + i}
              index={i}
              showBooleanOperator={i !== 0}
              {...conditions[i]}
              onChange={(booleanOperator, variable, operator, value) =>
                handleChangeCondition(i, booleanOperator, variable, operator, value)
              }
              onDelete={handleDeleteCondition}
              showDelete={conditions.length > 1}
            ></AutoTagConditionInput>
          ))}
      </div>
      <div className="flex flex-row justify-end gap-2 mt-48">
        <button className="c-button" onClick={handleClose}>
          Cancel
        </button>
        <button
          className="c-button"
          disabled={
            !tagName ||
            !conditions[0]?.variable ||
            !conditions[0]?.operator ||
            !conditions[0]?.value
          }
          onClick={async () => {
            if (tagName) {
              await handleSave({
                tagNameId: tagName.id,
                name,
                priority,
                conditions: conditions.filter((condition) => !!condition.value),
              });
            }
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default EditAutoTagModal;
