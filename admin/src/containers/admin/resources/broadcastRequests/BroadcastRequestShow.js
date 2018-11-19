import React from 'react';
import {
  Show,
  SimpleShowLayout,
  ReferenceField,
  TextField,
  RichTextField,
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
      <RichTextField source="broadcastRequest.note" label="Note" />

      <TextField source="broadcastRequest.location" label="Zona preferita"/>
      <TextField source="broadcastRequest.userPosition.coordinates[1]" label="Posizione utente / Latitudine"/>
      <TextField source="broadcastRequest.userPosition.coordinates[0]" label="Posizione utente / Longitudine"/>

    </SimpleShowLayout>
  </Show>
);

export default BroadcastRequestShow;
