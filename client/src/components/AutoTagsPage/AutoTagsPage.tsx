import './AutoTagsPage.scss';
import EditAutoTagModal from '../AddAutoTagModal/EditAutoTagModal';
import { useNavigate, useParams } from 'react-router-dom';
import type { AutoTag } from '../../types/types';
import { useDefaultServiceAutoTagsControllerFindAll } from '../../generated/api/queries';
import { useState } from 'react';
import { sortBy } from 'lodash-es';
interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const [selectedAutoTag, setSelectedAutoTag] = useState<AutoTag | null>(null);

  const { data: autoTags } = useDefaultServiceAutoTagsControllerFindAll({
    term: '',
  });

  const handleClose = () => navigate('/auto-tag-rules');

  const handleSave = (autoTag: Omit<AutoTag, 'id'>) => {
    handleClose();
  };

  return (
    <div>
      <button className="c-button" onClick={() => navigate('/auto-tag-rules/create')}>
        Add auto tag
      </button>
      <ul>
        {sortBy(autoTags || [], (autoTag) => autoTag.priority).map((autoTag: AutoTag) => (
          <li>
            {autoTag.priority} {autoTag.name} {autoTag.tagName}
          </li>
        ))}
      </ul>
      <EditAutoTagModal
        autoTag={selectedAutoTag}
        isOpen={action === 'create'}
        onClose={handleClose}
        onSave={handleSave}
      ></EditAutoTagModal>
    </div>
  );
}

export default AutoTagsPage;
