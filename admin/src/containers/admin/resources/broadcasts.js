import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Create, EditButton, ReferenceInput, SimpleForm, TextInput, NumberInput, AutocompleteInput,
  RadioButtonGroupInput, Edit, DisabledInput, SelectInput, BooleanInput} from 'react-admin';

  import { DateTimeInput } from 'react-admin-date-inputs';


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
    <SimpleForm>

      <ReferenceInput reference="events" source="event">
        <AutocompleteInput source="name" optionText="name"/>
      </ReferenceInput>
      <ReferenceInput reference="businesses" source="business">
        <SelectInput source="name"/>
      </ReferenceInput>
      <BooleanInput source="plus"/>
      {/*<NumberInput source="newsfeed"/>*/}

      <TextInput source="offer.title"/>
      <TextInput source="offer.description"/>
      <RadioButtonGroupInput source="offer.type" choices={[
        {id: "0", name: 'Prezzo fisso'},
        {id: "1", name: 'Sconto in percentuale'},
      ]}/>
      <NumberInput source="offer.value"/>
      <DateTimeInput source="start_at"  options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
      <DateTimeInput source="end_at"  options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
    </SimpleForm>
  </Create>
);


export const BroadcastEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="_id"/>
      <ReferenceInput reference="events" source="event">
        <AutocompleteInput source="name" optionText="name"/>
      </ReferenceInput>
      <ReferenceInput reference="businesses" source="business">
        <AutocompleteInput source="name"/>
      </ReferenceInput>

      <NumberInput source="newsfeed"/>
      <TextInput source="offer.title"/>
      <TextInput source="offer.description"/>
      <RadioButtonGroupInput source="offer.type" choices={[
        {id: "0", name: 'Prezzo fisso'},
        {id: "1", name: 'Sconto in percentuale'},
      ]}/>
      <NumberInput source="offer.value"/>
      <DateTimeInput source="start_at" options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>
      <DateTimeInput source="end_at"  options={{ format: "DD/MM/YYYY, HH:mm:ss"}}/>

    </SimpleForm>
  </Edit>
);
