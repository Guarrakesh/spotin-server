import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton,
  DisabledInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin';

export const CompetitionList = (props) => (
  <List {...props}>
    <Datagrid>


      <TextField source="name"/>
      <TextField source="country"/>
      <ReferenceField label="Sport" source="sport" reference="sports">
        <TextField source="name"/>
      </ReferenceField>
      <EditButton/>
    </Datagrid>
  </List>
);


const CompetitionTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>{record ? `${record.name}` : ''}</span>;
};

export const CompetitionEdit = (props) => (
  <Edit title={<CompetitionTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <SelectInput source="name"/>
      </ReferenceInput>
      <TextInput source="name"/>
      <TextInput source="country"/>

    </SimpleForm>


  </Edit>
);
export const CompetitionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>


      <TextInput source="name"/>
      <TextInput source="country"/>
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <SelectInput source="name"/>
      </ReferenceInput>

    </SimpleForm>
  </Create>
);
