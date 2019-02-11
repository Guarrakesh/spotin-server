import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import moment from 'moment';
import { push } from 'react-router-redux'; // eslint-disable-line
import {
  Show,
  CardContentInner,
  CardActions,
  EditButton,
  showNotification,
  UPDATE,
} from 'react-admin';

import { Typography, Chip, ListItemLink , Button } from "@material-ui/core";
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import DateTimeField from '../../components/DateTimeField';
import dataProvider from '../../../../providers/dataProvider';

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
              <ListItem
                  button={!!broadcast._id}
                 
                  key={index}>
                <ListItemLink
                    href={'/broadcasts/'+broadcast._id}>
                <ListItemText
                    primary={broadcast.event.name}
                              secondary={moment(broadcast.event.start_at).format("DD/MM/YY [alle] HH:mm")}/>
                </ListItemLink>
              </ListItem>
          ))}

        </List>

      </CardContentInner>
  )

};
const PublishButton = connect(undefined, { showNotification, push })(({ push, record, showNotification }) => {

  const handleClick = () => {
    const updated = { ...record, published: true };
    dataProvider(UPDATE, 'broadcastbundles', { id: record.id, data: updated })
        .then(() => {
          showNotification('Bundle pubblicato!');
          push('/broadcastbundles');
        })
        .catch(e => {
          console.error(e);
          showNotification('Errore: ' + e);
        })
  }
  return <Button color="primary" onClick={handleClick}>Pubblica</Button>

});

PublishButton.propTypes = {
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
};
const BroadcastBundleShowActions = ({ basePath, data }) => (
    <CardActions>
      <EditButton basePath={basePath} record={data}/>
      <PublishButton record={data}/>
    </CardActions>
);
BroadcastBundleShowActions.propTypes = {
  basePath: PropTypes.string,
  data: PropTypes.object,
}
const BroadcastBundleShow = (props) => {

  return (
      <Show actions={<BroadcastBundleShowActions/>}
            title={<BroadcastBundleTitle/>} {...props}>
        <BroadcastBundleShowView/>
      </Show>
  )
};

BroadcastBundleShowView.propTypes = {
  record: PropTypes.object,

};
export default BroadcastBundleShow;