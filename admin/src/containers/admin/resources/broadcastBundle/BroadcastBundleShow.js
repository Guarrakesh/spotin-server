import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Show,
  CardContentInner,
} from 'react-admin';

import { Typography, Chip, List, ListItem, ListItemText } from "@material-ui/core";
import DateTimeField from '../../components/DateTimeField';

/* eslint-disable */
const BroadcastBundleTitle = ({ record }) => {
  return <span>Bundle per {record.business.name} {moment(record.start).format("DD/MM/YY")}
    -{moment(record.end).format("DD/MM/YY")}</span>
};
/* eslint-enable */


const BroadcastBundleShowView
    = ({ record }) => {

  return (
      <CardContentInner>
        <Typography variant="display3">{record.business.name}</Typography>
        <Typography variant="h6">
          <span>Programmazione dal </span>
          <Chip label={<DateTimeField record={record} source="start"/>}/>
          <span> al </span>
          <Chip label={<DateTimeField record={record} source="end"/>}/>
        </Typography>
        <List>
          {record.broadcasts.map((broadcast, index) => (
            <ListItem key={index}>
              <ListItemText primary={broadcast.event.name}
                            secondary={moment(broadcast.event.start_at).format("DD/MM/YY [alle] HH:mm")}/>
            </ListItem>
          ))}

        </List>

      </CardContentInner>
  )

};
const BroadcastBundleShow = (props) => {

  return (
      <Show title={<BroadcastBundleTitle/>} {...props}>
        <BroadcastBundleShowView/>
      </Show>
  )
};

BroadcastBundleShowView.propTypes = {
  record: PropTypes.object,

};
export default BroadcastBundleShow;