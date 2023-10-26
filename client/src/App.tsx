import './App.scss';

import React from 'react';
import TimelinesPage from './components/TimelinesPage/TimelinesPage';
import AutoTagsPage from './components/AutoTagsPage/AutoTagsPage';
import { useNavigate, useParams } from 'react-router-dom';
import TagNamesPage from './components/TagNamesPage/TagNamesPage';

function App() {
  const params = useParams();
  const navigate = useNavigate();
  const tabId = params.tabId || 'timelines';

  return (
    <div>
      <div className="c-tabs">
        <span
          className={tabId === 'timelines' ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/timelines')}
        >
          timeline
        </span>
        <span
          className={tabId === 'autoTagRules' ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/auto-tag-rules')}
        >
          auto tag rules
        </span>
        <span
          className={tabId === 'tagNames' ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/tag-names')}
        >
          tag names
        </span>
      </div>
      {tabId === 'timelines' && <TimelinesPage></TimelinesPage>}
      {tabId === 'auto-tag-rules' && <AutoTagsPage></AutoTagsPage>}
      {tabId === 'tag-names' && <TagNamesPage></TagNamesPage>}
    </div>
  );
}

export default App;
