import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton,
  DisabledInput, ReferenceInput, SelectInput, SimpleForm, TextInput, BooleanInput,
  ImageInput, ImageField, Filter, AutocompleteInput, NumberInput,
} from 'react-admin';
import StyledImageField from '../fields/StyledImageField'; //eslint-disable-line


const styles = {
  pictureImg: {
    width: '32px',
    height: 'auto'
  },
  idCell: { width: '10%'},
  pictureCell: { width: '10%'}
};




const CompetitorFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Nome" source="q" alwaysOn />
    <ReferenceInput reference="sports" source="sport">
      <SelectInput label="Sport" source="name" />
    </ReferenceInput>
  </Filter>
);



export const CompetitorList = withStyles(styles)(({classes, ...props}) => (
  <List {...props} filters={<CompetitorFilter/>}>
    <Datagrid>
      <StyledImageField label="" source="image_versions[1].url" cellClassName={classes.pictureCell} imgClassName={classes.pictureImg} />
      <TextField source="_id" />
      <ReferenceField reference="sports" source="sport">
        <TextField source="name"/>
      </ReferenceField>

      <TextField source="name" />
      <TextField source="full_name" />


      <EditButton/>
    </Datagrid>
  </List>
));

const CompTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>User {record ? `"${record.name || record.full_name}"` : ''}</span>;
};

export const CompetitorEdit = (props) => (
  <Edit title={<CompTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <AutocompleteInput source="name"/>
      </ReferenceInput>
      <TextInput source="name" />
      <TextInput source="first_name"/>
      <TextInput source="last_name"/>
      <TextInput source="full_name"/>
      <TextField source="country" />
      <NumberInput source="appealValue" step={1} options={{min:1, max:4}}/>
      <ImageInput source="picture" accept="image/*">
        <ImageField source="src"/>
      </ImageInput>
      <ImageField source="image_versions[0].url" src="url" title="title"/>


      <BooleanInput source="is_club" label="Is a club"/>
      <BooleanInput source="isPerson" label="Is a person"/>



    </SimpleForm>
  </Edit>
);
export const CompetitorCreate = (props) => (
  <Create {...props} >
    <SimpleForm redirect="list">
      <ReferenceInput label="Sport" reference="sports" source="sport">
        <AutocompleteInput optionText="name"/>
      </ReferenceInput>
      <TextInput source="name" />
      <TextInput source="first_name"/>
      <TextInput source="last_name"/>
      <TextInput source="full_name"/>
      <TextField source="country" />
      <NumberInput source="appealValue" step={1} options={{min:1, max:4}}/>
        <ImageInput source="picture" accept="image/*">
          <ImageField source="src" title="title"/>
        </ImageInput>
      <BooleanInput source="is_club" label="Is a club"/>
      <BooleanInput source="isPerson" label="Is a person"/>
    </SimpleForm>
  </Create>
);
