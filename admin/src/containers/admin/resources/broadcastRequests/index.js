import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  ReferenceField,
  DateField } from 'react-admin';


export { default as BroadcastRequestShow } from './BroadcastRequestShow';
/* eslint-disable */
const UserReferenceField = ({ record, ...props }) => (
    record.broadcastRequest && record.broadcastRequest.user ?
        <ReferenceField record={record} reference="users" source="broadcastRequest.user" label="Utente" {...props} >
          <TextField source="name" label="Utente"/>
        </ReferenceField>
        : <span>Anonimo</span>
);
/* eslint-enable */


export const BroadcastRequestList = (props) => (
  <List {...props} filter={{requestType: 1}}>
    <Datagrid>

      <UserReferenceField/>
      <TextField source="broadcastRequest.email" label="Email"/>
      <TextField source="broadcastRequest.numOfPeople" label="Numero persone"/>
      <TextField source="broadcastRequest.maxDistance" label="Distanza massima"/>
      <TextField source="broadcastRequest.location" label="Zona preferita"/>
      <DateField source="created_at" showTime/>
      <ShowButton/>

    </Datagrid>
  </List>
);

