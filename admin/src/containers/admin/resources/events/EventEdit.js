import React from 'react';

import { TabbedForm, FormTab, Edit, DisabledInput, SelectInput,
  TextInput, NumberInput, ReferenceInput,
  LongTextInput, FormDataConsumer,
  ArrayInput, SimpleFormIterator, AutocompleteInput} from 'react-admin';
import { DateTimeInput } from 'react-admin-date-inputs';


const EventEdit = (props) => (
  <Edit {...props}>
    <TabbedForm>
      <FormTab label="General">
        <DisabledInput source="_id"/>
        <TextInput source="name"/>
        <ReferenceInput source="sport" reference="sports" label="Sport">
          <SelectInput optionText="name"/>
        </ReferenceInput>
        <FormDataConsumer>
          {({formData}) =>
            <ReferenceInput source="competition" reference="competitions"
                            filter={{sport: formData.sport}}>
              <SelectInput optionText="name"/>
            </ReferenceInput>
          }
        </FormDataConsumer>

        <LongTextInput source="description"/>
        <DateTimeInput label="Data evento" source="start_at" options={{ format: 'DD/MM/YYYY, HH:mm:ss', ampm: false, clearable: true }}/>
        <NumberInput source="spots"/>
      </FormTab>
      <FormTab label="Competitors">
        <FormDataConsumer>
          {({formData}) =>
            <ArrayInput source="competitors">
              <SimpleFormIterator>
                <ReferenceInput
                  filter={{sport: formData.sport}}
                  reference="competitors" source="_id" label="Competitor">
                  <AutocompleteInput optionText={({name, full_name}) => (name !== undefined ? name : full_name) }/>
                </ReferenceInput>


              </SimpleFormIterator>
            </ArrayInput>

          }
        </FormDataConsumer>
      </FormTab>
    </TabbedForm>
  </Edit>
)

export default EventEdit;
