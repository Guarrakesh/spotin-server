import React from 'react';
import PropTypes from 'prop-types';

import { List, Datagrid, TextField, ReferenceField, Create, EditButton, ReferenceInput, SimpleForm, TextInput, NumberInput, AutocompleteInput,
  RadioButtonGroupInput, Edit, DisabledInput, BooleanInput, LongTextInput, FormDataConsumer,
DateField} from 'react-admin';
import get from 'lodash/get';

import EventAutocompleteInput from '../events/EventAutocompleteInput';

import { DateTimeInput } from '../../components/DateTimeInput';

const businessInputValueMatcher = (input, suggestion, getOptionText) =>
  getOptionText(suggestion)
    .toLowerCase()
    .trim()
  === (input.toLowerCase().trim())
  ;

const ReservationCountField = ({record}) => (
  <span>{get(record, 'reservations').length}</span>
);
ReservationCountField.propTypes = {
  record: PropTypes.object,
};
export const BroadcastList = (props) => (
  <List {...props}>
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
    <SimpleForm defaultValue={{plus: false, offer: { type: "1"}}}>


      <EventAutocompleteInput/>
      <ReferenceInput reference="businesses" source="business">
        <AutocompleteInput
          optionText="name"
          inputValueMatcher={businessInputValueMatcher}
          source="name"/>
      </ReferenceInput>
      <BooleanInput source="plus"/>
      {/*<NumberInput source="newsfeed"/>*/}
      <FormDataConsumer>
        {({formData}) =>
          <TextInput
            options={{fullWidth: true}}
            disabled={formData.plus === false}
            source="offer.title" label="Titolo offerta (Solo PLUS)"/>
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({formData}) =>
          <LongTextInput
            disabled={formData.plus === false}
            source="offer.description" label="Descrizione offerta (Solo PLUS)"/>

        }
      </FormDataConsumer>


      <FormDataConsumer>
        {({formData}) =>
          <RadioButtonGroupInput
            disabled={formData.plus === false}
            label="Tipo offerta" source="offer.type" choices={[
            {id: "0", name: 'Prezzo fisso'},
            {id: "1", name: 'Sconto in percentuale'},
          ]}/>
        }
      </FormDataConsumer>

      <NumberInput source="offer.value" label="Valore offerta"/>
      <DateTimeInput source="start_at"
                     label="Inizio prenotazioni (Default 2 settimane prima)"
                     options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
      <DateTimeInput source="end_at"
                     label="Fine prenotazioni (Default 3 ore dopo)"
                     options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
    </SimpleForm>
  </Create>
);


export const BroadcastEdit = (props) => (
  <Edit {...props}>
    <SimpleForm defaultValue={{plus: false, offer: { type: "1"}}}>
      <DisabledInput source="_id"/>
      <EventAutocompleteInput/>
      <ReferenceInput reference="businesses" source="business">
        <AutocompleteInput source="name"
                           inputValueMatcher={businessInputValueMatcher}
                           optionText="name"/>
      </ReferenceInput>
      <BooleanInput source="plus"/>
      <NumberInput source="newsfeed"/>
      <FormDataConsumer>
        {({formData}) =>
          <TextInput
            options={{fullWidth: true}}
            disabled={formData.plus === false}
            source="offer.title" label="Titolo offerta (Solo PLUS)"/>
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({formData}) =>
          <LongTextInput
            disabled={formData.plus === false}
            source="offer.description" label="Descrizione offerta (Solo PLUS)"/>

        }
      </FormDataConsumer>

      <FormDataConsumer>
        {({formData}) =>
          <RadioButtonGroupInput
            disabled={formData.plus === false}
            label="Tipo offerta" source="offer.type" choices={[
            {id: "0", name: 'Prezzo fisso'},
            {id: "1", name: 'Sconto in percentuale'},
          ]}/>
        }
      </FormDataConsumer>

      <NumberInput source="offer.value" label="Valore offerta"/>
      <DateTimeInput source="start_at"

                     label="Inizio prenotazioni "
                     options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
      <DateTimeInput source="end_at"
                     label="Fine prenotazioni"
                     options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>

    </SimpleForm>
  </Edit>
);
