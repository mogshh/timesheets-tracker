import './AutoTagsPage.scss';
import EditAutoTagModal from '../EditAutoTagModal/EditAutoTagModal';
import { useNavigate, useParams } from 'react-router-dom';
import type { AutoTag } from '../../types/types';
import {
  useAutoTagsServiceAutoTagsControllerCreate,
  useAutoTagsServiceAutoTagsControllerFindAll,
} from '../../generated/api/queries';
import { ReactNode, useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { AutoTagConditionDto } from '../../generated/api/requests';

interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const id = params.id;
  const [selectedAutoTag, setSelectedAutoTag] = useState<AutoTag | null>(null);

  const { data: autoTags } = useAutoTagsServiceAutoTagsControllerFindAll({
    term: '',
  });
  const { mutateAsync: createAutoTag } = useAutoTagsServiceAutoTagsControllerCreate();

  useEffect(() => {
    if (autoTags) {
      // Set autoTag from url id
      const autoTagFromUrl = (autoTags.find((autoTag) => autoTag.id === id) ||
        null) as AutoTag | null;
      setSelectedAutoTag(autoTagFromUrl);
    }
  }, [id, autoTags]);

  const handleClose = () => navigate('/auto-tag-rules');

  const handleSave = (autoTag: Omit<AutoTag, 'id'>) => {
    handleClose();
    createAutoTag({
      requestBody: {
        name: autoTag.name,
        priority: autoTag.priority,
        tagNameId: autoTag.tagNameId,
        conditions: autoTag.conditions as unknown as AutoTagConditionDto[],
      },
    });
  };

  return (
    <div>
      <button className="c-button" onClick={() => navigate('/auto-tag-rules/create')}>
        Add auto tag
      </button>
      <ul>
        {sortBy(autoTags || [], (autoTag) => autoTag.priority).map(
          (autoTag): ReactNode => (
            <li key={'auto-tag-' + autoTag.id}>
              {autoTag.priority} {autoTag.name}{' '}
              <button
                className="c-button"
                onClick={() => {
                  setSelectedAutoTag(autoTag as unknown as AutoTag);
                  navigate('/auto-tag-rules/' + autoTag.id + '/edit');
                }}
              >
                EDIT
              </button>
            </li>
          )
        )}
      </ul>
      {!!action && autoTags && (
        <EditAutoTagModal
          autoTag={selectedAutoTag}
          isOpen={action === 'create' || action === 'edit'}
          onClose={handleClose}
          onSave={handleSave}
        ></EditAutoTagModal>
      )}
    </div>
  );
}

export default AutoTagsPage;
