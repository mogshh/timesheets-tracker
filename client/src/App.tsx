import './App.scss';

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export enum ROUTE_PARTS {
  timelines = 'timelines',
  autoTagRules = 'auto-tag-rules',
  tagNames = 'tag-names',
  create = 'create',
  edit = 'edit',
}

function App() {
  return (
    <div>
      <div className="c-tabs">
        <NavLink to={'/' + ROUTE_PARTS.timelines}>timeline</NavLink>
        <NavLink to={'/' + ROUTE_PARTS.autoTagRules}>auto tag rules</NavLink>
        <NavLink to={'/' + ROUTE_PARTS.tagNames}>tag names</NavLink>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
