import React from 'react';
import { List, ChipField, Datagrid, TextField, ReferenceField, EditButton,
} from 'react-admin';
import moment from 'moment';
import { get } from 'lodash';

export { default as EventEdit } from './EventEdit';
export { default as EventCreate } from './EventCreate';


/* eslint-disable*/
export const DateTimeField = ({record, source}) => {
  const sourceValue = get(record, source);

  const dateTime = moment(sourceValue).locale('IT').format('D-MM - HH:mm').toUpperCase();
  return (<span>{dateTime}</span>)
}
/* eslint-enable*/
export const EventList = (props) => (
  <List {...props}>
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
