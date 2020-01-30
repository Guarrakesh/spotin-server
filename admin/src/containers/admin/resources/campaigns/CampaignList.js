import React from 'react';
import { Datagrid, List, TextField, BooleanField } from 'react-admin';


/* eslint-disable */
const NumberOfRules = ({ record }) => (
    <span>{Object.keys(record.rewardRules).length}</span>
);

const CampaignList = (props) => (
  <List title="Campaigns" {...props}>
    <Datagrid>
      <TextField source="campaignType" />
      <TextField source="name"/>
      <TextField source="rewardType"/>
      <NumberOfRules label="# Rules"/>
      <BooleanField source="active"/>
    </Datagrid>
  </List>
);

export default CampaignList;
