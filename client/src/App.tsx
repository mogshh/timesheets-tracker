import './App.scss';

import React from 'react';
import TimelinesPage from './components/TimelinesPage/TimelinesPage';
import AutoTagsPage from './components/AutoTagsPage/AutoTagsPage';
import { useNavigate, useParams } from 'react-router-dom';

function App() {
  const params = useParams();
  const navigate = useNavigate();
  const tabId = params.tabId || 'timelines';

  return (
    <div>
      <div className="c-tabs">
        <span
          className={params.tabId === 'timelines' ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/timelines')}
        >
          timeline
        </span>
        <span
          className={params.tabId === 'autoTagRules' ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/auto-tag-rules')}
        >
          auto tag rules
        </span>
      </div>
      {params.tabId === 'timelines' && <TimelinesPage></TimelinesPage>}
      {params.tabId === 'auto-tag-rules' && <AutoTagsPage></AutoTagsPage>}
    </div>
  );
}

export default App;
