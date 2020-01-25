import React from 'react';
import {BooleanField, TextInput, Filter, Datagrid, EditButton, ShowButton, List, TextField} from 'react-admin';
import DateTimeField from "../../components/DateTimeField";



const SettingFilter = (props) => (
    <Filter {...props}>
      <TextInput label="Section" source="key" alwaysOn/>
      <TextInput label="Key" source="name" alwaysOn />
    </Filter>
);

/* eslint-disable */
const ValueField = ({ record, ...rest }) => (
    record.type === "array" && Array.isArray(record.value)?
        <ul>
          {record.value.map((item,i) => (
              <li key={i}>{item}</li>
          ))}
        </ul>
        : <TextField record={record} {...rest} />
)

const SettingList = props => (
    <List { ...props} filters={<SettingFilter/>}>
      <Datagrid>
          <TextField source="section"/>
          <TextField source="key"/>
          <ValueField source="value" />
          <BooleanField source="enabled"/>
          <DateTimeField source="createdAt"/>
          <EditButton/>
          <ShowButton/>
      </Datagrid>
    </List>
);

export default SettingList;
