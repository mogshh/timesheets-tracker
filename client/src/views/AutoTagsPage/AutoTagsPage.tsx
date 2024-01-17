import './AutoTagsPage.scss';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import {
  useAutoTagsServiceAutoTagsControllerDelete,
  useAutoTagsServiceAutoTagsControllerFindAll,
} from '../../generated/api/queries';
import React, { ReactNode } from 'react';
import { sortBy } from 'lodash-es';
import { ROUTE_PARTS } from '../../App';

interface AutoTagsPageProps {}

function AutoTagsPage({}: AutoTagsPageProps) {
  const { data: autoTags, refetch: refetchAutoTags } = useAutoTagsServiceAutoTagsControllerFindAll({
    term: '',
  });
  const { mutateAsync: deleteAutoTag } = useAutoTagsServiceAutoTagsControllerDelete();

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
              <button
                className="c-button"
                onClick={async () => {
                  if (autoTag.id) {
                    await deleteAutoTag({
                      id: autoTag.id,
                    });
                    await refetchAutoTags();
                  }
                }}
              >
                DELETE
              </button>
            </li>
          )
        )}
      </ul>

      <Outlet />
    </div>
  );
}

export default AutoTagsPage;
