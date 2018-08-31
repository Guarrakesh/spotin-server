import React from 'react';
import { TabbedForm, FormTab, Create, DisabledInput, SelectInput, TextInput, NumberInput,
BooleanInput, ReferenceInput, AutocompleteInput, LongTextInput, FormDataConsumer,
ArrayInput, SimpleFormIterator} from 'react-admin';
import { DateTimeInput } from 'react-admin-date-inputs';





const EventCreate = (props) => (
  <Create {...props}>
    <TabbedForm>
      <FormTab label="General">
        <TextInput source="name"/>
        <ReferenceInput source="sport" reference="sports" label="Sport">
          <SelectInput optionText="name"/>
        </ReferenceInput>
        <FormDataConsumer>
          {({formData, ...reset}) =>
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
          {({formData, ...rest}) =>
            <ArrayInput source="competitors">
              <SimpleFormIterator resource="competitors">
                <ReferenceInput
                  source="_id"
                  filter={{sport: formData.sport}}
                  reference="competitors">
                  <SelectInput source="_id" optionText={({name, full_name}) => (name !== undefined ? name : full_name) }/>
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
