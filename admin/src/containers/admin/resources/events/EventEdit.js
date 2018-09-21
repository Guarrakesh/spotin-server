import React from 'react';

import { TabbedForm, FormTab, Edit, DisabledInput, SelectInput,
  TextInput, NumberInput, ReferenceInput,
  LongTextInput, FormDataConsumer,AutocompleteInput,
  ArrayInput, SimpleFormIterator, SelectArrayInput,
  required,

  minLength,
  number,
  maxLength} from 'react-admin';
import { DateTimeInput } from 'react-admin-date-inputs';

const providers = [
  {id: "sky", name: "Sky"},
  {id: "mediaset-premium", name:"Mediaset Premium"},
  {id: "dazn", name: "DAZN"},
  {id: "digitale-terrestre", name: "Digitale Terrestre"},
];

const validateName = [required(), minLength(6), maxLength(128)];
const validateDesc = [minLength(8), maxLength(255)];
const validateDate = [required()];

const EventEdit = (props) => (
  <Edit {...props}>
    <TabbedForm>
      <FormTab label="General">
        <DisabledInput source="_id"/>
        <TextInput source="name" validate={validateName}/>
        <ReferenceInput source="sport" reference="sports" label="Sport"  validate={[required()]}>
          <SelectInput optionText="name"/>
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

        <LongTextInput source="description"  validate={validateDesc}/>
        <DateTimeInput label="Data evento" validate={validateDate}
                       source="start_at" options={{ format: 'DD/MM/YYYY, HH:mm:ss', ampm: false, clearable: true }}/>
        <NumberInput source="spots"  validate={[required(), number()]}/>
          <SelectArrayInput choices={providers} source="providers" optionValue="id"/>
    </FormTab>
      <FormTab label="Competitors">
        <FormDataConsumer>
        {({formData, record}) => {
          return (
          <ArrayInput source="competitors" >
            <SimpleFormIterator>
              <ReferenceInput
                filter={{sport: formData.sport || record.sport}}
                reference="competitors" source="competitor">
                <AutocompleteInput optionValue="_id" optionText={({name, full_name}) => (name !== undefined ? name : full_name) }/>
              </ReferenceInput>


            </SimpleFormIterator>
          </ArrayInput>
          )}
        }
      </FormDataConsumer>
      </FormTab>
    </TabbedForm>
  </Edit>
)

export default EventEdit;
