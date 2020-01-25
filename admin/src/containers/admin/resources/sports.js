import React from 'react';
import { List, Datagrid, TextField, Edit, Create, EditButton, BooleanField, BooleanInput,
   SimpleForm, TextInput, NumberInput } from 'react-admin';

export const SportList = (props) => (
  <List {...props}>
    <Datagrid>

      <TextField source="_id" />
      <TextField source="name"/>
      <TextField source="slug"/>

      <BooleanField source="active"/>
      <EditButton/>
    </Datagrid>
  </List>
);


const SportTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>{record ? `${record.name}` : ''}</span>;
};

export const SportEdit = (props) => (
  <Edit title={<SportTitle/>} {...props}>
    <SimpleForm>
      <TextInput disabled source="_id" />
      <TextInput source="name"/>
      <TextInput source="slug"/>
      <NumberInput source="duration" label="Durata (in minuti)"/>
      <NumberInput source="appealValue" step={1} options={{min:1, max:4}}/>
      <BooleanInput source="has_competitors"/>
      <BooleanInput source="active"/>
    </SimpleForm>


  </Edit>
);
export const SportCreate = (props) => (
  <Create {...props}>
    <SimpleForm>


      <TextInput source="name"/>
      <TextInput source="slug"/>
      <NumberInput source="appealValue" step={1} min={1} max={4}/>
      <NumberInput source="duration" label="Durata (in minuti)"/>
      <BooleanInput source="has_competitors"/>
      <BooleanInput source="active"/>
    </SimpleForm>
  </Create>
);
