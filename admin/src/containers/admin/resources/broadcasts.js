import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Create, EditButton, ReferenceInput, SimpleForm, TextInput, NumberInput, AutocompleteInput,
  RadioButtonGroupInput, Edit, DisabledInput, BooleanInput, LongTextInput, FormDataConsumer } from 'react-admin';

  import { DateTimeInput } from '../components/DateTimeInput';

  import eventSelectOptionRenderer from './events/eventSelectOptionRenderer';


const eventInputValueMatcher = (input, suggestion, getOptionText) =>
  getOptionText(suggestion)

    .toLowerCase()
    .trim()
  === (input.toLowerCase().trim())
  ;
const businessInputValueMatcher = (input, suggestion, getOptionText) =>
  getOptionText(suggestion)
    .toLowerCase()
    .trim()
  === (input.toLowerCase().trim())
  ;
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
        <TextField source="start_at" />
      </ReferenceField>
    
      <EditButton/>
    </Datagrid>
  </List>
);




export const BroadcastCreate = (props) => (
  <Create {...props}>
    <SimpleForm defaultValue={{plus: false, offer: { type: "1"}}}>

      <ReferenceInput reference="events" source="event"

                      sort={{field: "start_at", order: "ASC"}}>
        <AutocompleteInput source="name"

                           optionText={eventSelectOptionRenderer}
                           inputValueMatcher={eventInputValueMatcher}
                           translateChoice={false}
        />
      </ReferenceInput>
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
      <ReferenceInput reference="events" source="event">
        <AutocompleteInput source="name"
                           optionText={eventSelectOptionRenderer}
                           inputValueMatcher={eventInputValueMatcher}
                           translateChoice={false}/>
      </ReferenceInput>
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
