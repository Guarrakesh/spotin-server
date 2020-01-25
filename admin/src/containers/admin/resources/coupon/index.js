import React from 'react';
import PropTypes from 'prop-types';
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

  ReferenceField,
  TextField,
  TextInput,
  ShowButton,
  Show,
  SimpleShowLayout,
    DeleteButton,

} from 'react-admin';


const UsedBy = (...props) => (
    props.record && props.record.usedBy ?
        (  <ReferenceField {...props} source="usedBy" reference="users">
              <TextField source="name" label="Usato da"/>
            </ReferenceField>
        ): null
);
UsedBy.propTypes = {
  record: PropTypes.object,
};
export const CouponCodeList = props => (
    <List {...props}>
      <Datagrid>
        <TextField source="code" label="Codice"/>
        <NumberField source="value" label="Valore"/>
        <BooleanField source="used" label="Usato"/>
        <DateField showTime source="usedAt" label="Usato il"/>
        <UsedBy/>
        <ShowButton/>
      </Datagrid>

    </List>
);

export const CouponCodeCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <NumberInput source="value" label="Valore"/>
        <DateInput source="expiresAt" label="Scadenza"/>
        <TextInput source="type" label="Tipo (opzionale)"/>
      </SimpleForm>
    </Create>
);

export const CouponCodeEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="_id"/>
        <TextInput disabled source="code"/>
        <NumberInput source="value" label="Valore"/>
        <DateInput source="Data scadenza"/>
        <TextInput source="type" label="Tipo (opzionale)"/>
      </SimpleForm>
    </Edit>
);

export const CouponCodeShow = props => (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="code" label="Codice"/>
        <NumberField source="value" label="Valore"/>
        <BooleanField source="used" label="Usato"/>
        <DateField source="usedBy" label="Usato il"/>
        <DateField source="expiresAt" label="Scadenza"/>
        <UsedBy/>
        <DeleteButton/>
      </SimpleShowLayout>
    </Show>
)
