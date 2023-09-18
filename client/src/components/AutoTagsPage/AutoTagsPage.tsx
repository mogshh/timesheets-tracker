import './AutoTagsPage.scss';
import EditAutoTagModal from '../AddAutoTagModal/EditAutoTagModal';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoTag } from '../../../../types/types';
interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;

  const {} = useDefaultServiceAuto;

  const handleClose = () => navigate('/auto-tag-rules');

  const handleSave = (autoTag: AutoTag) => {
    handleClose();
  };

  return (
    <div>
      <button className="c-button" onClick={() => navigate('/auto-tag-rules/create')}>
        Add auto tag
      </button>
      <EditAutoTagModal
        isOpen={action === 'create'}
        onClose={handleClose}
        onSave={handleSave}
      ></EditAutoTagModal>
    </div>
  );
}

export default AutoTagsPage;
