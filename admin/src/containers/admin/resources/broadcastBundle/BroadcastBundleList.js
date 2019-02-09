import React from 'react';
import { List, Datagrid } from 'react-admin';

export const BroadcastBundleList = props => {

  return (
      <List {...props}>
        <Datagrid>
          <TextField source="id"/>
        </Datagrid>
      </List>
  )
};