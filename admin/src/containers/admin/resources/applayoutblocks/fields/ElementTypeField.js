import React from'react';

import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";

import { TextInput, ArrayInput, SimpleFormIterator } from 'react-admin';


const styles = {
  formControl: {
    padding: "1.5rem", border: "1px solid #ddd"
  }

};
/* eslint-disable */
const ElementTypeField = ({ field, source }) => {


  switch (field.fieldType) {
    case 'textbox': {
      return <TextInput source={`${source}`} label={field.label} />
    }
    case 'imageUrl': {
      return <TextInput source={`${source}`} label={field.label}/>
    }

    case 'group':
      return (
          <FormControl component="fieldset" style={styles.formControl}>
            <FormLabel component="legend">{field.label}</FormLabel>

            <FormGroup>
              {field.subElements.map(subEl => (
                  <ElementTypeField field={subEl} source={`${source}.${subEl.name}`}/>
              ))}
            </FormGroup>
          </FormControl>
      );

    case 'array': {
      return (
          <FormControl component="fieldset" style={styles.formControl}>
            <FormLabel component="legend">{field.label}</FormLabel>

            <FormGroup>
              <ArrayInput source={`${source}`}>
                <SimpleFormIterator style={{ marginTop: "1.2rem"}}>
                  <ElementTypeField field={field.arrayElement}/>
                </SimpleFormIterator>
              </ArrayInput>
            </FormGroup>
          </FormControl>
      );
    }
    default:
      return null;
  };


}


export default ElementTypeField;
