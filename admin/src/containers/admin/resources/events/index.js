import React from 'react';
import { List, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export { default as EventEdit } from './EventEdit';
export { default as EventCreate } from './EventCreate';

export const EventList = (props) => (
  <List {...props}>
    <Datagrid>
      <ReferenceField reference="sports" source="sport._id" label="Sport">
        <TextField source="name"/>
      </ReferenceField>
      <ReferenceField reference="competitions" source="competition._id">
        <TextField source="name"/>
      </ReferenceField>

      <TextField source="name"/>
      <EditButton/>

    </Datagrid>
  </List>
)