import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import {
  ArrayField,
  ArrayInput,
  SimpleFormIterator,
  AutocompleteInput,
  BooleanInput,
  DisabledInput,
  Edit,
  FormTab,
  ImageField,
  ImageInput,
  NumberInput,
  ReferenceInput,
  SelectArrayInput,
  SingleFieldList,
  TabbedForm,
  TextInput,
  Toolbar,
  RadioButtonGroupInput,
  LongTextInput,
} from 'react-admin';

import BusinessMapField from './BusinessMapField';
import VersionedImageField from "../fields/VersionedImageField";
import BusinessDayInput from "./BusinessDayInput";
import BusinessSaveButton from "./BusinessSaveButton";

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

const BusinessEditToolbar = props => {

  return (
      <Toolbar {...props}>
        <BusinessSaveButton previousData={props.record} // eslint-disable-line
                            isNew={false}
                            label="Salva"
                            redirect="list"
                            submitOnEnter={true}
        />
      </Toolbar>
  )
};

const BusinessEditAside = ({ record }) => (
    <div style={{ width: 200, margin: '1em' }}>
      <Typography variant="title">Dettagli</Typography>
      {record && (
          <React.Fragment>
          <Typography variant="body1">
            Data aggiunta: {record.createdAt }
          </Typography>
          <Typography variant="body1">
           Ultima modifica { record.updatedAt }
          </Typography>
          </React.Fragment>

        )}
    </div>
);
BusinessEditAside.propTypes = {
  record: PropTypes.object
};

const BusinessEdit = withStyles(styles)(({classes, ...props}) => {


  return (
      <Edit
          aside={<BusinessEditAside/>}
          title={<Title/>} { ...props}>

        <TabbedForm
            toolbar={<BusinessEditToolbar/>}

            defaultValue={defaultFormValue}
        >
          <FormTab label="General">
            <DisabledInput label="id" source="_id"/>
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
            <DisabledInput source="address.location.coordinates[1]" formClassName={classes.inlineBlock} label="Latitude"/>
            <DisabledInput source="address.location.coordinates[0]" formClassName={classes.inlineBlock} label="Longitude"/>
            <BusinessMapField isMarkerShown source="address.location.coordinates"/>
          </FormTab>
          <FormTab label="Orari di apertura">
            {[0,1,2,3,4,5,6].map(day =>
                (
                    <BusinessDayInput
                        source={`business_hours.${day}`} key={day} day={day}/>
                )
            )}
          </FormTab>
          <FormTab label="Offerte">
            <ArrayInput source="offers">
              <SimpleFormIterator>
                <RadioButtonGroupInput
                    parse={v => parseInt(v, 10)}
                    //format={v => v.toString()}
                    label="Tipo offerta" source="type" choices={[
                  {id: 0, name: 'Prezzo fisso'},
                  {id: 1, name: 'Sconto in percentuale'},
                ]}/>
                <TextInput source="title" label="Titolo offerta"/>
                <LongTextInput
                    source="description" label="Descrizione offerta"/>
                <NumberInput source="value" label="Valore offerta"/>

              </SimpleFormIterator>
            </ArrayInput>
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
          <FormTab label="Immagini">

            <ImageInput multiple source="pictures" accept="image/*">
              <ImageField source="src"/>
            </ImageInput>


            <ArrayField source="pictures">
              <SingleFieldList>
                <VersionedImageField source="versions"/>
              </SingleFieldList>
            </ArrayField>


          </FormTab>
        </TabbedForm>

      </Edit>


  )
});

export default BusinessEdit;
