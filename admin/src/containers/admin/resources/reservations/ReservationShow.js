import React from 'react';
import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  ReferenceField,
  DateField,
  BooleanField,


} from 'react-admin';
import ReviewTabContent from './ReviewTabContent';

/* eslint-disable */

const ReservationShow
    = ({
         ...props
       }) => {
  return (
      <Show {...props}>
        <TabbedShowLayout>
          <Tab label="Generali">
            <ReferenceField reference="users" source="user">
              <TextField source="name" label="Utente"/>
            </ReferenceField>
            <ReferenceField reference="events" source="event">
              <TextField source="name" label="Evento"/>
            </ReferenceField>
            <ReferenceField reference="businesses" source="business" label="Business">
              <TextField source="name" label="Locale"/>
            </ReferenceField>
            <DateField source="created_at" showTime/>
            <TextField source="peopleNum" label="Numero persone"/>
            <BooleanField source="used" label="Utilizzata"/>
          </Tab>
          <Tab label="Recensione">
            <ReviewTabContent/>


          </Tab>
        </TabbedShowLayout>
      </Show>
  )
};



export default ReservationShow;
