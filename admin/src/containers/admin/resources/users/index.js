import React from 'react';
import { List, Datagrid, TextField, ReferenceField, EmailField, Edit, Create, EditButton,
  DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput,
  required,
  email,
  minLength,
  maxLength,
  number} from 'react-admin';


export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="_id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
      <EditButton/>
    </Datagrid>
  </List>
);


const validateEmail = [required(), email()];
const validateName = [required(), minLength(3), maxLength(45)];
const validateLastName = [minLength(3), maxLength(45)];
const validateUsername = [minLength(3), maxLength(45)];
const validatePass = [required(), minLength(6), maxLength(128)];
let roles = [
  {id: "admin", name: "Admin"},
  {id: "business", name: "Business"},
  {id: "user", name: "User"}
];

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.name}"` : ''}</span>;
};

export const UserEdit = (props) => (
  <Edit title={<UserTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <TextInput source="email" validate={validateEmail}/>
      <TextInput source="name" validate={validateName}/>
      <TextInput source="lastname" validate={validateLastName}/>
      <TextInput source="username" validate={validateUsername}/>

      <SelectInput source="role" choices={roles} />

    </SimpleForm>
  </Edit>
);
export const UserCreate = (props) => (
<Create {...props}>
  <SimpleForm>
    <TextInput source="email" validate= {validateEmail}/>
    <TextInput source="name" validate={validateName}/>
    <TextInput source="lastname" validate={validateLastName}/>
    <TextInput source="username"  validate={validateUsername}/>
    <TextInput source="password" validate={validatePass} />
    <SelectInput source="role" choices={roles} />
  </SimpleForm>
</Create>
);
