import React from 'react';
import {Datagrid, List, EditButton, NumberField, ReferenceField, TextField} from 'react-admin';

/* eslint-disable */
const NumberOfFields = ({ record }) => (
    <span>{Object.keys(record.fields).length}</span>
);

 const AppLayoutBlockList = (props) => (
    <List title="App Layout Blocks" { ...props }>
      <Datagrid>
        <TextField source="id"/>
        <ReferenceField label="Element type" source="elementTypeId" reference="layout-elements">
          <TextField source="elementType"/>
        </ReferenceField>
        <TextField label="Screen" source="screen"/>
        <NumberField label="Order" source="order"/>
        <TextField label="Before element identifier" source="beforeElementIdentifier"/>
        <TextField label="After element identifier" source="afterElementIdentifier"/>
        <NumberOfFields label="# Fields"/>
        <EditButton/>
      </Datagrid>
    </List>
);

 export default AppLayoutBlockList;
