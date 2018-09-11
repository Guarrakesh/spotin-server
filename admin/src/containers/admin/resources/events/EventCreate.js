import React from 'react';
import { TabbedForm, FormTab, Create, SelectInput, TextInput, NumberInput, ReferenceInput, LongTextInput, FormDataConsumer,
ArrayInput, SimpleFormIterator,AutocompleteInput,
  required,

  minLength,
  number,
  maxLength} from 'react-admin';
import { DateTimeInput } from 'react-admin-date-inputs';



const validateName = [required(), minLength(6), maxLength(128)];
const validateDesc = [minLength(8), maxLength(255)];
const validateDate = [required()];

const EventCreate = (props) => (
  <Create {...props}>
    <TabbedForm>
      <FormTab label="General">
        <TextInput source="name" validate={validateName}/>
        <ReferenceInput source="sport" reference="sports" label="Sport" validate={[required()]}>
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

        <LongTextInput source="description" validate={validateDesc}/>
        <DateTimeInput label="Data evento" validate={validateDate}
                       source="start_at" options={{ format: 'DD/MM/YYYY, HH:mm:ss', ampm: false, clearable: true }}/>
        <NumberInput source="spots" validate={[required(), number()]}/>
      </FormTab>
      <FormTab label="Competitors">
        <FormDataConsumer>
          {({formData}) =>
            <ArrayInput source="competitors">
              <SimpleFormIterator resource="competitors">
                <ReferenceInput
                  filter={{sport: formData.sport}}
                  reference="competitors" source="_id">
                  <AutocompleteInput optionValue="_id" optionText={({name, full_name}) => (name !== undefined ? name : full_name) }/>
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
