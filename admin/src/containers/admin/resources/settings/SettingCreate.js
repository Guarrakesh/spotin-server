import PropTypes from 'prop-types';
import {FormDataConsumer} from "ra-core";
import React from 'react';
import {Create, NumberInput, RadioButtonGroupInput, SimpleForm, TextInput} from 'react-admin';

const choices = [
  { id: "string", name: "String" },
  { id: "number", name: "Number" },
  { id: "array", name: "Array" }
];



const parseValue = (value, type) => {
  if (type !== "array" || !value ) return value;
  return value.toString().split(',').map(v => v.trim());
};
const formatValue = (value, type) => {
  if (type !== "array" || Array.isArray(value) || !value) return value;
  return value.join(',');
};
const SettingCreate = (props) => {

  return(
      <Create {...props}>
        <SimpleForm>

          <TextInput source="section"/>
          <TextInput source="key"/>
          <RadioButtonGroupInput source="type" choices={choices}/>
          <FormDataConsumer>
            {({formData}) => {
              if (formData.type !== "number") {
                return <TextInput
                    format={v => formatValue(v, formData.type)}
                    parse={v => parseValue(v,formData.type )}
                    source="value"
                    placeholder={formData.type === "array" ? "value1,value2,value3" : ""}/>
              } else {
                return <NumberInput source="value"/>
              }
            }}
          </FormDataConsumer>
        </SimpleForm>
      </Create>
  );
};

SettingCreate.propTypes = {
  typeValue: PropTypes.string,
};
export default (SettingCreate);