import './TagNamesPage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import type { TagName } from '../../types/types';
import {
  useTagNamesServiceTagNamesControllerCreate,
  useTagNamesServiceTagNamesControllerFindAll,
  useTagNamesServiceTagNamesControllerRemove,
} from '../../generated/api/queries';
import React, { ReactNode, useEffect, useState } from 'react';
import EditTagNameModal from '../EditTagNameModal/EditTagNameModal';
import { ROUTE_PARTS } from '../../App';

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
  const { mutateAsync: deleteTagName } = useTagNamesServiceTagNamesControllerRemove();

  useEffect(() => {
    if (tagNames) {
      // Set autoTag from url id
      const tagNameFromUrl = (tagNames.find((tagName) => tagName.id === id) ||
        null) as TagName | null;
      setSelectedTagName(tagNameFromUrl);
    }
  }, [id, tagNames]);

  const handleClose = () => navigate('/' + ROUTE_PARTS.tagNames);

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
    <div className="p-tag-names">
      <button
        className="c-button"
        onClick={() => navigate('/' + ROUTE_PARTS.tagNames + '/' + ROUTE_PARTS.create)}
      >
        Add tag name
      </button>
      <ul>
        {(tagNames || []).map(
          (tagName): ReactNode => (
            <li className="c-row" key={'tag-name-' + tagName.id}>
              <span>{tagName.name}</span>
              <button
                className="c-button"
                onClick={() => {
                  setSelectedTagName(tagName as unknown as TagName);
                  navigate('/' + ROUTE_PARTS.tagNames + '/' + tagName.id + '/' + ROUTE_PARTS.edit);
                }}
              >
                EDIT
              </button>
              <button
                className="c-button"
                onClick={async () => {
                  if (tagName.id) {
                    await deleteTagName({
                      id: tagName.id,
                    });
                  }
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
          isOpen={action === ROUTE_PARTS.create || action === ROUTE_PARTS.edit}
          onClose={handleClose}
          onSave={handleSave}
        ></EditTagNameModal>
      )}
    </div>
  );
}

export default TagNamesPage;
