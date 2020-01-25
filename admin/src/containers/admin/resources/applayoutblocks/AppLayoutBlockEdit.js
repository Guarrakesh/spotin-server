
import React from 'react';
import {Edit, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput} from 'react-admin';
import FieldFormGenerator from "./FieldFormGenerator";

const AppLayoutBlockCreate = (props) => {


  return (
      <Edit {...props}>
        <SimpleForm>
          <TextInput disabled label="id" source="_id"/>
          <ReferenceInput label="Element types" source="elementTypeId" reference="layout-elements">
            <SelectInput optionText="elementType"/>
          </ReferenceInput>
          <TextInput source="name" label="Name"/>
          <TextInput source="screen" label="Screen"/>
          <NumberInput source="order" label="Order"/>


          <FieldFormGenerator source="fields"/>
        </SimpleForm>
      </Edit>
  )

};




export default AppLayoutBlockCreate;
