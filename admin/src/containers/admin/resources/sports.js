import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton, BooleanField, BooleanInput,
  DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin';

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


const SportTitle = ({ record }) => {
  return <span>{record ? `${record.name}` : ''}</span>;
};

export const SportEdit = (props) => (
  <Edit title={<SportTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <TextInput source="name"/>
      <TextInput source="slug"/>

      <BooleanInput source="active"/>
    </SimpleForm>


  </Edit>
);
export const SportCreate = (props) => (
  <Create {...props}>
    <SimpleForm>


      <TextInput source="name"/>
      <TextInput source="slug"/>

      <BooleanInput source="active"/>
    </SimpleForm>
  </Create>
);
