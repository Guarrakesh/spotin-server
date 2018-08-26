import React from 'react';
import { List, Datagrid, TextField, ReferenceField, EmailField, Edit, Create, EditButton,
  DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput,
  required,
  email,
  minValue,
  maxValue,
  number} from 'react-admin';


export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="_id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);


const validateEmail = [required(), email()];
const validateName = [required(), minValue(3), maxValue(45)];
const validateLastName = [minValue(3), maxValue(3)];
const validateUsername = [minValue(6), maxValue(6)];
const validatePass = [required(), minValue(6), maxValue(128)];
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
