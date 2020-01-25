import PropTypes from 'prop-types';
import React from 'react';
import {
  ArrayInput,
  BooleanInput,
  Create,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput
} from 'react-admin';
import ParameterReferenceSelectInput from './ParameterReferenceSelectInput';
import parameterTypes from './parameterTypes';

const EventCreate = ({ ...props }) => {

  return (
      <Create {...props}>
        <SimpleForm >

          <TextInput source="name" label="Name"  validate={required()}/>
          <TextInput source="slug" label="slug"  validate={required()} helperText="Una volta definita questa proprietà, non sarà modificabile"/>
          <ArrayInput source="parameters" label="Parameters">
            <SimpleFormIterator>
              <TextInput fullWidth label="Name" source="name"  validate={required()}/>
              <SelectInput fullWidth label="Type" source="type"  validate={required()} choices={parameterTypes} />
              <ParameterReferenceSelectInput/>
              <BooleanInput source="required" label="Required"/>
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleForm>
      </Create>
  )

};

EventCreate.propTypes = {
  onCancel: PropTypes.func,
}


export default EventCreate;
