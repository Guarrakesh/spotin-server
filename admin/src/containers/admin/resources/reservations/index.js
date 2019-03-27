import React from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid,
  BooleanField, TextField,
  EditButton, ReferenceField, DateField,
  Filter, ReferenceInput, AutocompleteInput,
  ShowButton} from 'react-admin';

import EventAutocompleteInput from '../events/EventAutocompleteInput';

export {default as ReservationShow} from './ReservationShow';


const ReviewStatus = ({ record }) => {
  let status = null;
  if (record.review) {
    switch(record.review.status) {
      case 0: { status = "Pending"; break; }
      case 1: { status = "Confermata"; break; }
      case -1: { status = "Rifiutata"; break; }
      default: { status = "Non definito"; }
    }
  }
  return (
      <span>
        {status || "Non effettuata"}
      </span>
  );
};
ReviewStatus.propTypes = {
  record: PropTypes.object,
}

const ReservationFilter = (props) => (
  <Filter {...props}>

    <ReferenceInput reference="users" source="user">
      <AutocompleteInput label="Utente" source="name" />
    </ReferenceInput>
    <ReferenceInput reference="events" source="event">
      <EventAutocompleteInput />
    </ReferenceInput>
    <ReferenceInput reference="businesses" source="broadcast.business" label="Business">
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
      <ReferenceField reference="businesses" source="broadcast.business" label="Business">
        <TextField source="name" label="Locale"/>
      </ReferenceField>
      <DateField source="created_at" showTime/>
      <TextField source="peopleNum" label="Numero persone"/>
      <ReviewStatus label="Recensione"/>
      <BooleanField source="used" label="Utilizzata"/>

      <EditButton disabled/>
      <ShowButton/>
    </Datagrid>
  </List>
);

