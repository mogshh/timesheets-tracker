import './App.scss';

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import DateSelect from './components/DateSelect/DateSelect';

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
      <nav className="m-main-navigation">
        <div className="c-tabs">
          <NavLink to={'/' + ROUTE_PARTS.timelines}>timeline</NavLink>
          <NavLink to={'/' + ROUTE_PARTS.autoTagRules}>auto tag rules</NavLink>
          <NavLink to={'/' + ROUTE_PARTS.tagNames}>tag names</NavLink>
        </div>
        <DateSelect />
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
