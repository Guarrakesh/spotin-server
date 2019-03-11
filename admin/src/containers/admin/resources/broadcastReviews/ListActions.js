import React from 'react';
import Button from '@material-ui/core/Button';
import { CardActions, CreateButton, RefreshButton } from 'react-admin';
import { Link } from 'react-router-dom';

/* eslint-disable */
const ListActions = ({
                       bulkActions,
                       basePath,
                       currentSort,
                       displayedFilters,
                       exporter,
                       filters,
                       filterValues,
                       onUnselectItems,
                       resource,
                       selectedIds,
                       showFilter,
                       total
                     }) => (
    <CardActions>
      {bulkActions && React.cloneElement(bulkActions, {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
      })}
      {filters && React.cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      }) }

      <CreateButton basePath={basePath} />
      <RefreshButton />

      <Button color="primary"><Link to="/broadcastreviewsquestions">
          {"Impostazioni domande"}
        </Link>
      </Button>
    </CardActions>
);

export default ListActions;
