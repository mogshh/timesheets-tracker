import './AutoTagsPage.scss';
import EditAutoTagModal from '../../components/EditAutoTagModal/EditAutoTagModal';
import { NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { AutoTag } from '../../types/types';
import {
  useAutoTagsServiceAutoTagsControllerCreate,
  useAutoTagsServiceAutoTagsControllerFindAll,
} from '../../generated/api/queries';
import React, { ReactNode, useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { AutoTagConditionDto } from '../../generated/api/requests';
import { ROUTE_PARTS } from '../../App';

interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const params = useParams();
  const id = params.id;

  const { data: autoTags } = useAutoTagsServiceAutoTagsControllerFindAll({
    term: '',
  });

  return (
    <div>
      <NavLink className="c-button" to={'/' + ROUTE_PARTS.autoTagRules + '/' + ROUTE_PARTS.create}>
        Add auto tag
      </NavLink>

      <ul>
        {sortBy(autoTags || [], (autoTag) => autoTag.priority).map(
          (autoTag): ReactNode => (
            <li className="c-row" key={'auto-tag-' + autoTag.id}>
              <span>
                {autoTag.priority} {autoTag.name}{' '}
              </span>
              <NavLink
                className="c-button"
                to={'/' + ROUTE_PARTS.autoTagRules + '/' + autoTag.id + '/' + ROUTE_PARTS.edit}
              >
                EDIT
              </NavLink>
            </li>
          )
        )}
      </ul>

      <Outlet />
    </div>
  );
}

export default AutoTagsPage;
