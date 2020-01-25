import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton,
   TextInput, ReferenceInput, SelectInput, SimpleForm } from 'react-admin';

export const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id"/>
      <ReferenceField label="User" source="userId" reference="users">
        <TextField source="name"/>
      </ReferenceField>
      <TextField source="title"/>
      <TextField source="body"/>
      <EditButton/>
    </Datagrid>
  </List>
);


const PostTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>Post {record ? `"${record.title}"` : ''}</span>;
};


export const PostEdit = (props) => (
  <Edit title={<PostTitle/>} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput label="User" source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title"/>
      <TextInput source="body"/>
    </SimpleForm>
  </Edit>
);
export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput source="body" />
    </SimpleForm>
  </Create>
);
