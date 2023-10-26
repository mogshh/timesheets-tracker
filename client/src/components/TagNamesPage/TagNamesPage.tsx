import './TagNamesPage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import type { AutoTag, TagName } from '../../types/types';
import {
  useTagNamesServiceTagNamesControllerCreate,
  useTagNamesServiceTagNamesControllerFindAll,
} from '../../generated/api/queries';
import React, { ReactNode, useEffect, useState } from 'react';
import EditTagNameModal from '../EditTagNameModal/EditTagNameModal';

interface TagNamesPageProps {}

function TagNamesPage({}: TagNamesPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const id = params.id;
  const [selectedTagName, setSelectedTagName] = useState<TagName | null>(null);

  const { data: tagNames } = useTagNamesServiceTagNamesControllerFindAll({
    term: '',
  });
  const { mutateAsync: createTagName } = useTagNamesServiceTagNamesControllerCreate();

  useEffect(() => {
    if (tagNames) {
      // Set autoTag from url id
      const tagNameFromUrl = (tagNames.find((tagName) => tagName.id === id) ||
        null) as TagName | null;
      setSelectedTagName(tagNameFromUrl);
    }
  }, [id, tagNames]);

  const handleClose = () => navigate('/tag-names');

  const handleSave = (tagName: Omit<TagName, 'id'>) => {
    handleClose();
    createTagName({
      requestBody: {
        name: tagName.name,
        color: tagName.color,
      },
    });
  };

  return (
    <div>
      <button className="c-button" onClick={() => navigate('/tag-names/create')}>
        Add auto tag
      </button>
      <ul>
        {(tagNames || []).map(
          (tagName): ReactNode => (
            <li className="c-row" key={'auto-tag-' + tagName.id}>
              <span>{tagName.name}</span>
              <button
                className="c-button"
                onClick={() => {
                  setSelectedTagName(tagName as unknown as TagName);
                  navigate('/tag-names/' + tagName.id + '/edit'); // TODO make ROUTE_PARTS variable
                }}
              >
                EDIT
              </button>
              <button
                className="c-button"
                onClick={() => {
                  deleteTagName(tagName.id);
                }}
              >
                DELETE
              </button>
            </li>
          )
        )}
      </ul>
      {!!action && tagNames && (
        <EditTagNameModal
          tagName={selectedTagName}
          isOpen={action === 'create' || action === 'edit'}
          onClose={handleClose}
          onSave={handleSave}
        ></EditTagNameModal>
      )}
    </div>
  );
}

export default TagNamesPage;
