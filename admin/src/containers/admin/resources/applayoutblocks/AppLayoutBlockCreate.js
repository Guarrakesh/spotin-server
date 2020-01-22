
import React from 'react';
import {Create, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput} from 'react-admin';
import FieldFormGenerator from "./FieldFormGenerator";

const AppLayoutBlockCreate = (props) => {


  return (
      <Create {...props}>
        <SimpleForm>
          <ReferenceInput label="Element types" source="elementTypeId" reference="layout-elements">
            <SelectInput optionText="elementType"/>
          </ReferenceInput>
          <TextInput source="name" label="Name"/>
          <TextInput source="screen" label="Screen"/>
          <NumberInput source="order" label="Order"/>


          <FieldFormGenerator source="fields"/>
        </SimpleForm>
      </Create>
  )

};




export default AppLayoutBlockCreate;
