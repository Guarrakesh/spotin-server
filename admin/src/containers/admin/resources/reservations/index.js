import React from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid,
  BooleanField, TextField,
  EditButton, ReferenceField, DateField,
  Filter, ReferenceInput, AutocompleteInput,
  ShowButton} from 'react-admin';
import { red, green, orange } from '@material-ui/core/colors';
import { Chip, withStyles } from '@material-ui/core';
import EventAutocompleteInput from '../sportevents/EventAutocompleteInput';

export {default as ReservationShow} from './ReservationShow';

const reviewStatusStyle = {
  pending: {
    backgroundColor: orange[400], color: '#fff'
  },
  confirmed: { backgroundColor: green[400], color: '#fff' },
  rejected: { backgroundColor: red[400], color: '#fff' },
}
const ReviewStatus = withStyles(reviewStatusStyle)(({classes, record }) => {
  let status, className;

  if (record.review) {
    switch(parseInt(record.review.status)) {
      case 0: { status = "Pending"; className = classes.pending; break; }
      case 1: { status = "Confermata"; className = classes.confirmed; break; }
      case -1: { status = "Rifiutata"; className = classes.rejected; break; }
      default: { status = "Non definito"; }
    }
  }
  return (
      <Chip className={className} label=
        {status || "Non effettuata"}
      />
  );
});
ReviewStatus.propTypes = {
  record: PropTypes.object,
};

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

