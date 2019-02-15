import React from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, EmailField, Edit, Create, EditButton,
  DisabledInput, SelectInput, SimpleForm, TextInput, DateField,
  ImageField,
  Filter,
  required,
  email,
  minLength,
  maxLength,
  } from 'react-admin';


let roles = [
  {id: "admin", name: "Admin"},
  {id: "business", name: "Business"},
  {id: "user", name: "User"}
];
const FacebookAccountField = ({ record }) => {
  if (!record.services || !record.services.facebook) {
    return null;
  }
  return (<a href={`https://facebook.com/${record.services.facebook}`}>{record.name}</a>);
};
FacebookAccountField.propTypes = {
  record: PropTypes.object,
}
const UserFilter = (props) => (
  <Filter {...props}>
    <SelectInput source="role" choices={roles} alwaysOn/>
    <TextInput source="email"/>
    <TextInput source="name"/>
  </Filter>
);
export const UserList = (props) => (
  <List {...props} filters={<UserFilter/>}>
    <Datagrid>
      <ImageField source="picture"/>
      <TextField source="_id" />
      <TextField source="name" />
      <TextField source="username" />
      <DateField source="created_at" showTime/>
      <FacebookAccountField label="Account Facebook" source="services.facebook"/>

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

const validateEqualPass = (value, allValues) => {
  return (value !== allValues.password) ? "Le password non coincidono." : undefined;
};

const UserTitle = ({ record }) => { //eslint-disable-line react/prop-types
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
    <TextInput source="password" validate={validatePass} type="password"/>
    <TextInput source="confirm_password" validate={validateEqualPass} type="password"/>

    <SelectInput source="role" choices={roles} />
  </SimpleForm>
</Create>
);
