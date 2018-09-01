import React from 'react';
import { List, Datagrid, TextField, ReferenceField,
  Edit, Create, EditButton, BooleanField, BooleanInput,
  DisabledInput, LongTextInput, ReferenceInput,
  SelectInput, SimpleForm, TextInput, NumberInput,
  RadioButtonGroupInput } from 'react-admin';

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
        <SelectInput source="name"/>
      </ReferenceInput>
      <ReferenceInput reference="businesses" source="business">
        <SelectInput source="name"/>
      </ReferenceInput>

      <NumberInput source="newsfeed"/>
      <TextInput source="offer.title"/>
      <TextInput source="offer.description"/>
      <RadioButtonGroupInput source="offer.type" choices={[
        {id: "0", name: 'Prezzo fisso'},
        {id: "1", name: 'Sconto in percentuale'},
        {id: "2", name: 'Sconto assoluto'},
      ]}/>
      <NumberInput source="offer.value"/>


    </SimpleForm>
  </Create>
);
