import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { TabbedForm, FormTab, Edit,
  DisabledInput, SelectInput, TextInput, NumberInput,
  ReferenceInput, AutocompleteInput, BooleanInput, SelectArrayInput} from 'react-admin';

import BusinessMapField from './BusinessMapField';


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
  {id: "mediaset-premium", name:"Mediaset Premium"},
  {id: "dazn", name: "DAZN"},
  {id: "digitale-terrestre", name: "Digitale Terrestre"},
];


const styles = {
  inlineBlock: { display: 'inline-flex', marginRight: '1em'}
};


const Title = ({record}) => { //eslint-disable-line react/prop-types
  return <span>{record ? record.name : ''}</span>
}
const BusinessEdit = withStyles(styles)(({classes, ...props}) => {

    return (
      <Edit title={<Title/>} { ...props}>
        <TabbedForm>
          <FormTab label="General">
            <DisabledInput label="id" source="_id"/>
            <TextInput source="name"/>
            <SelectInput choices={types} source="type" label="Business Type"/>
            <TextInput source="phone"/>
            <ReferenceInput source="user"
                            reference="users"
                            filter={{role: "business"}}
                            allowEmpty={false}
                            >
              <AutocompleteInput optionText="email"/>
            </ReferenceInput>
            <NumberInput source="spots"/>
          </FormTab>
          <FormTab label="Address">
            <TextInput source="address.street" label="Street"/>
            <TextInput source="address.number" label="Number"/>
            <TextInput source="address.city" label="City"/>
            <TextInput source="address.province" label="Province"/>
            <TextInput source="address.country" label="Country"/>
            <NumberInput source="address.zip" label="Zip"/>
            <DisabledInput source="address.location.coordinates[1]" formClassName={classes.inlineBlock} label="Latitude"/>
            <DisabledInput source="address.location.coordinates[0]" formClassName={classes.inlineBlock} label="Longitude"/>
            <BusinessMapField isMarkerShown source="address.location.coordinates"/>
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
            <SelectArrayInput choices={providers} source="providers" optionValue="id"/>



          </FormTab>
        </TabbedForm>

      </Edit>


    )
});

export default BusinessEdit;
