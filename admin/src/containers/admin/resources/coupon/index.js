import React from 'react';
import {
  List,
  Datagrid,
  NumberField,
  BooleanField,
  DateField,
  Create,
  SimpleForm,
  NumberInput,
  DateInput,
  Edit,
  DisabledInput,
  ReferenceField,
  TextField,
  TextInput,

} from 'react-admin';

export const CouponCodeList = props => (
    <List {...props}>
      <Datagrid>
        <TextField source="code" label="Codice"/>
        <NumberField source="value" label="Valore"/>
        <BooleanField source="used" label="Usato"/>
        <DateField source="usedBy" label="Usato il"/>
        <ReferenceField source="usedBy" reference="users">
          <TextField source="name" label="Usato da"/>
        </ReferenceField>
      </Datagrid>
    </List>
);

export const CouponCodeCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <NumberInput source="value" label="Valore"/>
        <DateInput source="Data scadenza"/>
        <TextInput source="type" label="Tipo (opzionale)"/>
      </SimpleForm>
    </Create>
);

export const CouponCodeEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <DisabledInput source="_id"/>
        <DisabledInput source="code"/>
        <NumberInput source="value" label="Valore"/>
        <DateInput source="Data scadenza"/>
        <TextInput source="type" label="Tipo (opzionale)"/>
      </SimpleForm>
    </Edit>
);
