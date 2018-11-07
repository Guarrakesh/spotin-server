import React from 'react';
import { List, Datagrid, ChipField, TextField, EditButton,
  TextInput,
  Filter,
} from 'react-admin';


export {default as BusinessEdit} from './BusinessEdit';
export {default as BusinessCreate} from './BusinessCreate';

const BusinessFilter = (props) => (
  <Filter {...props}>
    <TextInput source="name" alwaysOn/>
  </Filter>
);
export const BusinessList = (props) => (
  <List {...props} filters={<BusinessFilter/>}>
    <Datagrid>

      <TextField source="name" label="Nome"/>

      <ChipField source="type" label="Tipo"/>
      <TextField source="address.street" label="Indirizzo"/>
      <EditButton/>
    </Datagrid>
  </List>
);

