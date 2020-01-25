import React from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, EmailField, Edit, Create, EditButton,
  SelectInput, SimpleForm, TextInput, DateField,

  Filter,
  required,
  email,
  minLength,
  maxLength,
  } from 'react-admin';

import { withStyles } from '@material-ui/core';

let roles = [
  {id: "admin", name: "Admin"},
  {id: "business", name: "Business"},
  {id: "user", name: "User"}
];
const FacebookAccountField = ({ record }) => {
  if (!record.services || !record.services.facebook) {
    return null;
  }
  return (<a href={`https://facebook.com/profile.php?id=${record.services.facebook}`}>{record.name}</a>);
};
FacebookAccountField.propTypes = {
  record: PropTypes.object,
};

const FacebookImageField = ({ record, ...props }) => {
  if (!record.picture) return null;

  return <img src={record.picture} {...props}/>;
};
FacebookImageField.propTypes = {
  record: PropTypes.object,
  classes: PropTypes.object
};

const UserFilter = (props) => (
  <Filter {...props}>
    <SelectInput source="role" choices={roles} alwaysOn/>
    <TextInput source="email"/>
    <TextInput source="name"/>
  </Filter>
);

const userListStyles = {
  image: {
    maxWidth: 80,
    maxHeight: 80,
  }
};
export const UserList = withStyles(userListStyles)(({classes, ...props}) => (
  <List {...props} filters={<UserFilter/>}>
    <Datagrid>
      <FacebookImageField className={classes.image}/>
      <TextField source="_id" />
      <TextField source="name" />
      <TextField source="username" />
      <DateField source="created_at" showTime/>
      <FacebookAccountField label="Account Facebook" source="services.facebook"/>

      <EmailField source="email" classes={classes} />
      <EditButton/>
    </Datagrid>
  </List>
));


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
      <TextInput disabled source="_id" />
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
