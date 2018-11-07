import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  ReferenceField,
  DateField } from 'react-admin';


export { default as BroadcastRequestShow } from './BroadcastRequestShow';

export const BroadcastRequestList = (props) => (
  <List {...props} filter={{requestType: 1}}>
    <Datagrid>
      <ReferenceField reference="users" source="broadcastRequest.user" label="Utente">
        <TextField source="name" label="Utente"/>
      </ReferenceField>
      <ReferenceField reference="events" source="broadcastRequest.event" label="Evento">
        <TextField source="name" label="Evento"/>
      </ReferenceField>
      <TextField source="broadcastRequest.numOfPeople" label="Numero persone"/>
      <TextField source="broadcastRequest.maxDistance" label="Distanza massima"/>
      <DateField source="created_at" showTime/>
      <ShowButton/>

    </Datagrid>
  </List>
);

