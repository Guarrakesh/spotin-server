import React from 'react';
import PropTypes from 'prop-types';

import { List, Datagrid, TextField, ReferenceField, Create, EditButton, ReferenceInput, SimpleForm, TextInput, NumberInput, AutocompleteInput,
  RadioButtonGroupInput, Edit, Filter, DisabledInput, LongTextInput,
  DateField} from 'react-admin';
import get from 'lodash/get';

import EventAutocompleteInput from '../events/EventAutocompleteInput';
import { DateTimeInput } from '../../components/DateTimeInput';
import businessInputValueMatcher from '../helpers/businessInputValueMatcher';


const ReservationCountField = ({record}) => (
    <span>{get(record, 'reservations').length}</span>
);
ReservationCountField.propTypes = {
  record: PropTypes.object,
};

const BroadcastFilter = (props) => (
    <Filter {...props}>
      <ReferenceInput reference="events" source="event">
        <EventAutocompleteInput />
      </ReferenceInput>
      <ReferenceInput reference="businesses" source="business">
        <AutocompleteInput label="Locale" source="name" />
      </ReferenceInput>

    </Filter>
);
export const BroadcastList = (props) => (
    <List {...props} filters={<BroadcastFilter/>}>
      <Datagrid>

        <ReferenceField reference="events" source="event">
          <TextField source="name"/>
        </ReferenceField>
        <ReferenceField reference="businesses" source="business">
          <TextField source="name"/>
        </ReferenceField>
        <ReferenceField reference="events" source="event" label="Event date">
          <DateField source="start_at" showTime/>
        </ReferenceField>
        <TextField>
        </TextField>
        <ReservationCountField source="reservations" label="Prenotazioni"/>
        <EditButton/>
      </Datagrid>
    </List>
);




export const BroadcastCreate = (props) => (
    <Create {...props}>
      <SimpleForm defaultValue={{ offer: { type: "1"}}}>


        <EventAutocompleteInput/>

        <ReferenceInput reference="businesses" source="business">
          <AutocompleteInput
              optionText="name"
              inputValueMatcher={businessInputValueMatcher}
              source="name"/>
        </ReferenceInput>
        {/*<NumberInput source="newsfeed"/>*/}

        <TextInput
            options={{fullWidth: true}}
            source="offer.title" label="Titolo offerta"/>

        <LongTextInput
            source="offer.description" label="Descrizione offerta"/>




        <RadioButtonGroupInput
            label="Tipo offerta" source="offer.type" choices={[
          {id: "0", name: 'Prezzo fisso'},
          {id: "1", name: 'Sconto in percentuale'},
        ]}/>


        <NumberInput source="offer.value" label="Valore offerta"/>
        <DateTimeInput source="start_at"
                       label="Inizio prenotazioni (Default 2 settimane prima)"
                       options={{ format: "dd///MM/YYYY, HH:mm:ss"}}/>
        <DateTimeInput source="end_at"
                       label="Fine prenotazioni (Default 3 ore dopo)"
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>
      </SimpleForm>
    </Create>
);


export const BroadcastEdit = (props) => (
    <Edit {...props}>
      <SimpleForm defaultValue={{offer: { type: "1"}}}>
        <DisabledInput source="_id"/>
        <EventAutocompleteInput/>

        <ReferenceInput reference="businesses" source="business">
          <AutocompleteInput source="name"
                             inputValueMatcher={businessInputValueMatcher}
                             optionText="name"/>
        </ReferenceInput>
        <NumberInput source="newsfeed"/>

        <TextInput
            options={{fullWidth: true}}
            source="offer.title" label="Titolo offerta "/>



        <LongTextInput
            source="offer.description" label="Descrizione offerta"/>

        <RadioButtonGroupInput
            label="Tipo offerta" source="offer.type" choices={[
          {id: "0", name: 'Prezzo fisso'},
          {id: "1", name: 'Sconto in percentuale'},
        ]}/>


        <NumberInput source="offer.value" label="Valore offerta"/>
        <DateTimeInput source="start_at"

                       label="Inizio prenotazioni "
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>
        <DateTimeInput source="end_at"
                       label="Fine prenotazioni"
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>


        <RadioButtonGroupInput
            label="Tipo offerta" source="offer.type" choices={[
          {id: "0", name: 'Prezzo fisso'},
          {id: "1", name: 'Sconto in percentuale'},
        ]}/>

      </SimpleForm>
    </Edit>
);
