import {makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {
  ArrayInput,
  BooleanInput,
  Edit,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Toolbar
} from 'react-admin';
import DeleteButtonWithConfirmation from "../../components/DeleteButtonWithConfirmationDialog";
import ParameterReferenceSelectInput from "./ParameterReferenceSelectInput";
import parameterTypes from "./parameterTypes";

const useStyles = makeStyles({
  defaultToolbar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
})
const EditActions = (props) => {
  const classes = useStyles();

  return (
      <Toolbar className={classes.defaultToolbar}>

        <SaveButton {...props}/>
        <DeleteButtonWithConfirmation {...props} title="Sicuro di continuare?"
                                      content="Quest evento può essere attualmente usato da codice.
                                    Rimuovendolo, potresti compromettere il comportamento del sistema."/>
      </Toolbar>
  )
}
const EventEdit = (props) => {


  return (
      <Edit {...props} >
        <SimpleForm toolbar={<EditActions/>}>
          <TextInput disabled label="id" source="_id"/>

            <TextInput source="name" label="Name" validate={required()}/>
            <TextInput source="slug" disabled label="slug"  validate={required()}/>
            <ArrayInput source="parameters" label="Parameters">
              <SimpleFormIterator>
                <TextInput fullWidth label="Name" source="name"  validate={required()}/>
                <SelectInput fullWidth label="Type" source="type"  validate={required()} choices={parameterTypes} />
                <ParameterReferenceSelectInput/>
                <BooleanInput source="required" label="Required"/>
              </SimpleFormIterator>
            </ArrayInput>

        </SimpleForm>
      </Edit>
  )

};




export default EventEdit;
