import './TagNamesPage.scss';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import type { TagName } from '../../types/types';
import {
  useTagNamesServiceTagNamesControllerFindAll,
  useTagNamesServiceTagNamesControllerRemove,
} from '../../generated/api/queries';
import React, { ReactNode, useEffect, useState } from 'react';
import { ROUTE_PARTS } from '../../App';
import { toast } from 'react-toastify';

interface TagNamesPageProps {}

function TagNamesPage({}: TagNamesPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const id = params.id;
  const [selectedTagName, setSelectedTagName] = useState<TagName | null>(null);

  const { data: tagNames, refetch: refetchTagNames } = useTagNamesServiceTagNamesControllerFindAll({
    term: '',
  });
  const { mutateAsync: deleteTagName } = useTagNamesServiceTagNamesControllerRemove();

  useEffect(() => {
    if (tagNames) {
      // Set autoTag from url id
      const tagNameFromUrl = (tagNames.find((tagName) => tagName.id === id) ||
        null) as TagName | null;
      setSelectedTagName(tagNameFromUrl);
    }
  }, [id, tagNames]);

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
              <span
                className="block h-16 w-16 ml-2"
                style={{ backgroundColor: tagName.color }}
              ></span>
              <span className="flex-grow">{tagName.name}</span>
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
                    await refetchTagNames();

                    toast('Tag name has been deleted', { type: 'success' });
                  } else {
                    toast('Tag name could not be deleted, no id has been set', { type: 'warning' });
                  }
                }}
              >
                DELETE
              </button>
            </li>
          )
        )}
      </ul>

      <Outlet />
    </div>
  );
}

export default TagNamesPage;
