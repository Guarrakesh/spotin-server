import React from 'react';

import { TabbedForm, FormTab, Edit, DisabledInput, SelectInput,
  TextInput, ReferenceInput,
  LongTextInput, FormDataConsumer,AutocompleteInput,
  ArrayInput, SimpleFormIterator, SelectArrayInput,
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
  //     var utcDate = new Date( date.getTime() + (date.getTimezoneOffset() * 60000));
  //     return utcDate.toISOString();
  //   } catch (error) { return value; }
  // }
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
        {/* <TextInput type="datetime-local"
      //    parse={dateParser}
          InputLabelProps={{
            shrink: true,
          }}
          label="Data evento" validate={validateDate}
        source="start_at" /> */}
          <DateTimeInput validate={validateDate} source="start_at"  options={{ format: "dd/MM/YYYY, HH:mm:ss" }}/>
        <SelectArrayInput choices={providers} source="providers" optionValue="id"/>
        <DisabledInput source="appealValue"/>
      </FormTab>
      <FormTab label="Competitors">
        <FormDataConsumer>
          {({formData, record}) => {
            return (
              <ArrayInput source="competitors">
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
