import './EditTagNameModal.scss';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { TagName } from '../../../../types/types';
import { COLOR_LIST } from '../TimelinesPage/TimelinesPage.consts';

interface EditTagNameProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagName: Omit<TagName, 'id'>) => void;
  tagName: TagName | null;
}

function EditTagNameModal({ isOpen, onClose, onSave, tagName }: EditTagNameProps) {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>(COLOR_LIST[0]);

  useEffect(() => {
    if (tagName) {
      setName(tagName.name);
      setColor(tagName.color);
    }
  }, [tagName]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      classNames={{ modal: 'c-add-tag-name-modal', closeButton: 'c-button c-button--small' }}
    >
      <h3>Add tag name</h3>
      <h4>Name</h4>
      <input
        value={name}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => setName(evt.target?.value)}
      />
      <h4>Color</h4>
      <input
        value={color}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => setColor(evt.target?.value)}
      />
      <div className="flex flex-row justify-end gap-2 mt-48">
        <button className="c-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="c-button"
          disabled={!name || !color}
          onClick={() => {
            onSave({
              name,
              color,
            });
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default EditTagNameModal;
