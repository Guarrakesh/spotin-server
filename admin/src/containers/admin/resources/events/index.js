import React from 'react';
import { List, 
  ChipField, 
  Datagrid, 
  TextField,
  ReferenceField, 
  EditButton,
  Filter, 
  ReferenceInput, 
  TextInput, 
  SelectInput
} from 'react-admin';

import moment from 'moment';
import { get } from 'lodash';
import { DateTimeInput } from '../../components/DateTimeInput';
/* eslint-disable */

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
/* eslint-enable */
export { default as EventEdit } from './EventEdit';
export { default as EventCreate } from './EventCreate';


/* eslint-disable*/
export const DateTimeField = ({record, source}) => {
  const sourceValue = get(record, source);

  const dateTime = moment(sourceValue).locale('IT').format('D/MM [alle] HH:mm').toUpperCase();
  return (<span>{dateTime}</span>)
}
/* eslint-enable*/


const EventFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Nome" source="name" alwaysOn />
    <ReferenceInput reference="sports" source="sport">
      <SelectInput label="Sport" source="name" />
    </ReferenceInput>
    <ReferenceInput reference="competitions" source="competition">
      <SelectInput label="Competizione" source="name" />
    </ReferenceInput>
    <DateTimeInput source="start_at" 
    providerOptions={{utils: MomentUtils}}
     options={{ format: "dd/MM/YYYY", ampm: false, clearable: true}}/>
  </Filter>
);



export const EventList = (props) => (
  <List {...props} filters={<EventFilter/>} filter={{next_events: true}}>
    <Datagrid>
      <ReferenceField reference="sports" source="sport" label="Sport">
        <TextField source="name"/>
      </ReferenceField>
      <ReferenceField reference="competitions" source="competition">
        <TextField source="name"/>
      </ReferenceField>
      <ChipField source="providers[0]" label="Providers"/>
      <DateTimeField source="start_at"/>

      <TextField source="name"/>
      <EditButton/>

    </Datagrid>
  </List>
)
