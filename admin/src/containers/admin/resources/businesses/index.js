import React from 'react';
import { List, Datagrid, TextField, EditButton } from 'react-admin';


export {default as BusinessEdit} from './BusinessEdit';
export {default as BusinessCreate} from './BusinessCreate';
export const BusinessList = (props) => (
  <List {...props}>
    <Datagrid>

      <TextField source="name" label="Nome"/>
      <TextField source="type" label="Tipo"/>
      <TextField source="address.street" label="Indirizzo"/>
      <EditButton/>
    </Datagrid>
  </List>
);

