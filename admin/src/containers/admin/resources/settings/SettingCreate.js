import {FormDataConsumer } from "ra-core";
import {Create, SimpleForm, RadioButtonGroupInput , TextInput, NumberInput } from 'react-admin';
import React from 'react';

const choices = [
  { id: "string", name: "String" },
  { id: "number", name: "Number" },
  { id: "object", name: "Object" },
  { id: "array", name: "Array" }
];

const Message = () => (
  <div style={{ backgroundColor: '#e67e22', color: '#fff', fontWeight: '700', padding: 21, borderRadius: 4}}>
    Ancora in sviluppo, non fate le pazze!
  </div>
);

const SettingCreate = (props) => (
    <Create {...props}>
      <SimpleForm>
        <Message/>
        <TextInput source="key"/>
        <RadioButtonGroupInput source="type" choices={choices}/>
        <FormDataConsumer>
          {({ formData }) => {
            if (formData.type === "string") {
              return <TextInput source="value"/>
            } else if (formData.type === "number") {
              return <NumberInput source="value"/>
            }
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
);

export default SettingCreate;