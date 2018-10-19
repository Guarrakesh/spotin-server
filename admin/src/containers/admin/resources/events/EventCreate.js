import React from 'react';
import { TabbedForm, FormTab, Create, SelectInput, TextInput, NumberInput, ReferenceInput, LongTextInput, FormDataConsumer,
ArrayInput, SimpleFormIterator,AutocompleteInput,SelectArrayInput,
  required,

  minLength,
  number,
  maxLength} from 'react-admin';



const providers = [
  {id: "sky", name: "Sky"},
  {id: "mediaset-premium", name:"Mediaset Premium"},
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
          <TextInput
            //parse={dateParser}
            type="datetime-local"

            InputLabelProps={{
              shrink: true,
            }}
            label="Data evento" validate={validateDate}
            source="start_at" />
        <NumberInput source="spots" validate={[required(), number()]}/>
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
