import './AutoTagsPage.scss';
import AddAutoTagModal from '../AddAutoTagModal/AddAutoTagModal';
import { useNavigate, useParams } from 'react-router-dom';
interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;

  return (
    <div>
      <button className="c-button" onClick={() => navigate('/auto-tag-rules/create')}>
        Add auto tag
      </button>
      <AddAutoTagModal
        isOpen={action === 'create'}
        onClose={() => navigate('/auto-tag-rules')}
      ></AddAutoTagModal>
    </div>
  );
}

export default AutoTagsPage;
