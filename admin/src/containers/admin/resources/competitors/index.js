import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton,
  DisabledInput, ReferenceInput, SelectInput, SimpleForm, TextInput, BooleanInput,
} from 'react-admin';


export const CompetitorList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="_id" />
      <ReferenceField reference="sports" source="sport">
        <TextField source="name"/>
      </ReferenceField>

      <TextField source="name" />
      <TextField source="full_name" />
      <EditButton/>
    </Datagrid>
  </List>
);


const CompTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>User {record ? `"${record.name || record.full_name}"` : ''}</span>;
};

export const CompetitorEdit = (props) => (
  <Edit title={<CompTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <SelectInput source="name"/>
      </ReferenceInput>
      <TextInput source="name" />
      <TextInput source="first_name"/>
      <TextInput source="last_name"/>
      <TextInput source="full_name"/>
      <BooleanInput source="isPerson" label="Is a person"/>



    </SimpleForm>
  </Edit>
);
export const CompetitorCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput label="Sport" reference="sports" source="sport">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <TextInput source="name" />
      <TextInput source="first_name"/>
      <TextInput source="last_name"/>
      <TextInput source="full_name"/>
      <BooleanInput source="isPerson" label="Is a person"/>
    </SimpleForm>
  </Create>
);
