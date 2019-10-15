import React from 'react';

/* eslint-disable */

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
/* eslint-enable */



import { TabbedForm, FormTab, Create, SelectInput, TextInput, ReferenceInput, LongTextInput, FormDataConsumer,
ArrayInput, SimpleFormIterator,AutocompleteInput,SelectArrayInput,
  required,
  minLength,
  maxLength} from 'react-admin';

import { DateTimeInput } from '../../components/DateTimeInput';

const providers = [
  {id: "sky", name: "Sky"},
  {id: "dazn-business", name:"DAZN Business"},
  {id: "dazn", name: "DAZN"},
  {id: "digitale-terrestre", name: "Digitale Terrestre"},
];


const validateName = [required(), minLength(6), maxLength(128)];
const validateDesc = [minLength(8), maxLength(255)];
const validateDate = [required()];
// const dateParser = value => {
//   const date = new Date(value);
//   if (!date) return value;
//   try {
//     return date.toISOString();
//   } catch (error) { return value; }
// }

const EventCreate = (props) => (

  <Create {...props}>
    <TabbedForm>
      <FormTab label="General">
        <TextInput source="name" validate={validateName}/>
        <ReferenceInput source="sport" reference="sports" label="Sport" validate={[required()]}>
          <AutocompleteInput optionText="name"/>
        </ReferenceInput>
        <FormDataConsumer>
          {({formData}) =>
            <ReferenceInput source="competition" reference="competitions"
                            validate={[required()]}
                            filter={{sport: formData.sport}}>
              <SelectInput optionText="name"/>
            </ReferenceInput>
          }
        </FormDataConsumer>

        <LongTextInput source="description" validate={validateDesc}/>
        { /*  <TextInput
            //parse={dateParser}
            type="datetime-local"

            InputLabelProps={{
              shrink: true,
            }}
            label="Data evento" validate={validateDate}
          source="start_at" /> */}
            <DateTimeInput validate={validateDate} source="start_at"
                           label="Inizio evento"
                           options={{ format: "dd/MM/YYYY, HH:mm:ss",  ampm: false, clearable: true }}/>
          <SelectArrayInput choices={providers} source="providers" optionValue="id"/>
    </FormTab>
      <FormTab label="Competitors">
        <FormDataConsumer>
          {({formData}) =>
            <ArrayInput source="competitors">
              <SimpleFormIterator resource="competitors">
                <ReferenceInput
                  filter={{sport: formData.sport}}
                  reference="competitors" source="competitor">
                  <AutocompleteInput allowEmpty optionValue="_id" optionText={({name, full_name}) => (name !== undefined ? name : full_name) }/>
                </ReferenceInput>



              </SimpleFormIterator>
            </ArrayInput>
          }
        </FormDataConsumer>
      </FormTab>
    </TabbedForm>
  </Create>
)

export default EventCreate;
