import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Edit, Create, EditButton, BooleanInput, NumberInput,
  DisabledInput, ReferenceInput, SimpleForm, AutocompleteInput, TextInput, ImageField, ImageInput, Filter, SelectInput} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import StyledImageField from './fields/StyledImageField'; //eslint-disable-line

const styles = {
  pictureImg: {
    width: '32px',
    height: 'auto'
  },
  idCell: { width: '10%'},
  pictureCell: { width: '10%'}
};

const CompetitionFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Nome" source="name" alwaysOn />
    <ReferenceInput reference="sports" source="sport">
      <SelectInput label="Sport" source="name"/>
    </ReferenceInput>
  </Filter>
);



export const CompetitionList = withStyles(styles)(({classes, ...props}) => (
  <List {...props}  filters={<CompetitionFilter/>}>
    <Datagrid>

      <StyledImageField label="" source="image_versions[0].url" cellClassName={classes.pictureCell} imgClassName={classes.pictureImg} />
      <TextField source="name"/>
      <TextField source="country"/>
      <ReferenceField label="Sport" source="sport" reference="sports">
        <TextField source="name"/>
      </ReferenceField>
      <EditButton/>
    </Datagrid>
  </List>
));


const CompetitionTitle = ({ record }) => { //eslint-disable-line react/prop-types
  return <span>{record ? `${record.name}` : ''}</span>;
};

export const CompetitionEdit = (props) => (
  <Edit title={<CompetitionTitle/>} {...props}>
    <SimpleForm>
      <DisabledInput source="_id" />
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <AutocompleteInput source="name"/>
      </ReferenceInput>
      <TextInput source="name"/>
      <TextInput source="country"/>
      <BooleanInput source="competitorsHaveLogo"/>
      <NumberInput source="appealValue" step={1} options={{min:1, max:4}}/>
      <ImageInput source="picture" accept="image/*">
        <ImageField source="src"/>
      </ImageInput>
      <ImageField source="image_versions[0].url" src="url" title="title"/>

    </SimpleForm>


  </Edit>
);
export const CompetitionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>


      <TextInput source="name"/>
      <TextInput source="country"/>
      <ReferenceInput label="Sport" source="sport" reference="sports">
        <AutocompleteInput source="name"/>
      </ReferenceInput>
      <BooleanInput source="competitorsHaveLogo"/>
      <NumberInput source="appealValue" step={1} options={{min:1, max:4}}/>
      <ImageInput source="picture" accept="image/*">
        <ImageField source="src" title="title"/>
      </ImageInput>
    </SimpleForm>
  </Create>
);
