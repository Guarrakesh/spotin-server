import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  ReferenceField,
  DateField } from 'react-admin';
import ListActions from "./ListActions";


export { default as BroadcastReviewShow } from './BroadcastReviewShow';

export const BroadcastReviewList = (props) => (
  <List {...props} filter={{requestType: 1}}
    actions={<ListActions/>}
    >
    <Datagrid>
      <ReferenceField reference="users" source="user" label="Utente">
        <TextField source="name" label="Utente"/>
      </ReferenceField>
      <ReferenceField reference="event" source="event" label="Evento">
        <TextField source="name" label="Evento"/>
      </ReferenceField>
      <ReferenceField reference="event" source="business" label="Business">
        <TextField source="name" label="Business"/>
      </ReferenceField>
      <TextField source="rating" label="Punteggio"/>
      <TextField source="personalRating" label="Punteggio personale"/>
      <DateField source="createdAt" showTime/>
      <ShowButton/>

    </Datagrid>
  </List>
);

