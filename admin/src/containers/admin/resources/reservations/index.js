import React from 'react';
import { List, Datagrid,
  BooleanField, TextField,
  EditButton, ReferenceField, DateField,
  Filter, ReferenceInput, AutocompleteInput} from 'react-admin';

import EventAutocompleteInput from '../events/EventAutocompleteInput';

export {default as ReservationShow} from './ReservationShow';

const ReservationFilter = (props) => (
  <Filter {...props}>

    <ReferenceInput reference="users" source="user">
      <AutocompleteInput label="Utente" source="name" />
    </ReferenceInput>
    <ReferenceInput reference="events" source="event">
      <EventAutocompleteInput />
    </ReferenceInput>
    <ReferenceInput reference="businesses" source="business">
      <AutocompleteInput label="Locale" source="name" />
    </ReferenceInput>

  </Filter>
);

export const ReservationList = (props) => (
  <List {...props}  filters={<ReservationFilter/>}>
    <Datagrid>
      <ReferenceField reference="users" source="user">
        <TextField source="name" label="Utente"/>
      </ReferenceField>
      <ReferenceField reference="events" source="event">
        <TextField source="name" label="Evento"/>
      </ReferenceField>
      <ReferenceField reference="businesses" source="business">
        <TextField source="name" label="Locale"/>
      </ReferenceField>
      <DateField source="created_at" showTime/>
      <BooleanField source="used" label="Utilizzata"/>

      <EditButton disabled/>
    </Datagrid>
  </List>
);

