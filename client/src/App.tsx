import './App.scss';

import React from 'react';
import TimelinesPage from './components/TimelinesPage/TimelinesPage';
import AutoTagsPage from './components/AutoTagsPage/AutoTagsPage';
import { useNavigate, useParams } from 'react-router-dom';
import TagNamesPage from './components/TagNamesPage/TagNamesPage';

export enum ROUTE_PARTS {
  timelines = 'timelines',
  autoTagRules = 'auto-tag-rules',
  tagNames = 'tag-names',
  create = 'create',
  edit = 'edit',
}

function App() {
  const params = useParams();
  const navigate = useNavigate();
  const tabId = params.tabId || ROUTE_PARTS.timelines;

  return (
    <div>
      <div className="c-tabs">
        <span
          className={tabId === ROUTE_PARTS.timelines ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/' + ROUTE_PARTS.timelines)}
        >
          timeline
        </span>
        <span
          className={tabId === ROUTE_PARTS.autoTagRules ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/' + ROUTE_PARTS.autoTagRules)}
        >
          auto tag rules
        </span>
        <span
          className={tabId === ROUTE_PARTS.tagNames ? 'c-tabs__tab--active' : ''}
          onClick={() => navigate('/' + ROUTE_PARTS.tagNames)}
        >
          tag names
        </span>
      </div>
      {tabId === ROUTE_PARTS.timelines && <TimelinesPage></TimelinesPage>}
      {tabId === ROUTE_PARTS.autoTagRules && <AutoTagsPage></AutoTagsPage>}
      {tabId === ROUTE_PARTS.tagNames && <TagNamesPage></TagNamesPage>}
    </div>
  );
}

export default App;
