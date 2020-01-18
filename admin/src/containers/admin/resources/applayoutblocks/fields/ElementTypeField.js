import React from 'react';
import { TextInput } from 'react-admin';


/* eslint-disable */
const ElementTypeField = ({ field, source }) => {


  switch (field.fieldType) {
    case 'textbox': {
      return <TextInput source={`${source}.${field.name}`} label={field.label} />
    }
    case 'imageUrl': {
      return <TextInput source={`${source}.${field.name}`} label={field.label}/>
    }
    case 'group': {
      
    }
    default:
      return null;
  };


}


export default ElementTypeField;
