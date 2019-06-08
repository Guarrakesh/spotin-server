import React from 'react';


import { withStyles } from '@material-ui/core/styles';
import { TabbedForm, FormTab, Create, Toolbar,
  DisabledInput, TextInput, NumberInput, BooleanInput, SelectArrayInput, ReferenceInput, AutocompleteInput, ImageField,
  ImageInput} from 'react-admin';
import BusinessDayInput from "./BusinessDayInput";
import  BusinessSaveButton  from "./BusinessSaveButton";

const types = [
  {id:'Pub', name: 'Pub'},
  {id:'Pizzeria', name: 'Pizzeria'},
  {id:'Ristorante', name: 'Ristorante'},
  {id: 'Trattoria', name: 'Trattoria'},
  {id: 'Bar', name: 'Bar'},
  {id: 'Centro Scommesse', name: 'Centro Scommesse'},
];
const providers = [
  {id: "sky", name: "Sky"},
  {id: "dazn-business", name:"DAZN Business"},
  {id: "dazn", name: "DAZN"},
  {id: "digitale-terrestre", name: "Digitale Terrestre"},
];


const styles = {
  inlineBlock: { display: 'inline-flex', marginRight: '1em'}
};

const defaultFormValue = {
  business_hours: {
    0: { openings: [] },
    1: { openings: [] },
    2: { openings: [] },
    3: { openings: [] },
    4: { openings: [] },
    5: { openings: [] },
    6: { openings: [] }}
};







const BusinessCreate = withStyles(styles)(({classes, ...props}) => {
  return (
      <Create { ...props}>
        <TabbedForm

            toolbar={<Toolbar><BusinessSaveButton label="Salva" redirect="list" submitOnEnter={true}/></Toolbar>}
            defaultValue={defaultFormValue}
        >
          <FormTab label="General">
            <TextInput source="name"/>
            <SelectArrayInput choices={types} source="type" label="Business Type"/>
            <TextInput source="phone"/>
            <ReferenceInput source="user"
                            reference="users"
                            filter={{role: "business"}}
                            allowEmpty={false}
            >
              <AutocompleteInput optionText="email"/>

            </ReferenceInput>
            <NumberInput source="spots"/>
            <ImageInput source="picture" accept="image/*">
              <ImageField source="src"/>
            </ImageInput>
            <ImageField source="cover_versions[0].url" src="url" title="title"/>

          </FormTab>
          <FormTab label="Address">
            <TextInput source="address.street" label="Street"/>
            <TextInput source="address.number" label="Number"/>
            <TextInput source="address.city" label="City"/>
            <TextInput source="address.province" label="Province"/>
            <TextInput source="address.country" label="Country"/>
            <NumberInput source="address.zip" label="Zip"/>
            <DisabledInput source="address.latitude" formClassName={classes.inlineBlock} label="Latitude"/>
            <DisabledInput source="address.longitude" formClassName={classes.inlineBlock} label="Longitude"/>
          </FormTab>
          <FormTab label="Orari di apertura">
            {[0,1,2,3,4,5,6].map(day =>
                (
                    <BusinessDayInput
                        source={`business_hours.${day}`} key={day} day={day}/>
                )
            )}
          </FormTab>
          <FormTab label="Billing">
            <TextInput source="vat"/>
            <TextInput source="tradeName"/>

          </FormTab>
          <FormTab label="Extra">
            <BooleanInput source="wifi"/>
            <BooleanInput source="forFamilies"/>
            <NumberInput source="seats"/>
            <NumberInput source="tvs"/>
            <TextInput source="target"/>
            <TextInput label="URL Quicker Menu" source="quickerMenuURL"/>
            <SelectArrayInput choices={providers} source="providers" optionValue="id"/>
            <BooleanInput source="isRecommended" label="Consigliato"/>



          </FormTab>

        </TabbedForm>

      </Create>


  )
});

export default BusinessCreate;
