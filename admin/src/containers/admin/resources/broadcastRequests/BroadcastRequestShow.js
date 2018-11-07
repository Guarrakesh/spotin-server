import React from 'react';
import {
  Show,
  SimpleShowLayout,
  ReferenceField,
  TextField,
  DateField} from 'react-admin';

const BroadcastRequestShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ReferenceField reference="users" source="broadcastRequest.user" label="Utente">
        <TextField source="name" label="Utente"/>
      </ReferenceField>
      <ReferenceField reference="events" source="broadcastRequest.event" label="Evento">
        <TextField source="name" label="Evento"/>
      </ReferenceField>
      <TextField source="broadcastRequest.numOfPeople" label="Numero persone"/>
      <TextField source="broadcastRequest.maxDistance" label="Distanza massima"/>
      <DateField source="created_at" showTime/>
    </SimpleShowLayout>
  </Show>
);

export default BroadcastRequestShow;
