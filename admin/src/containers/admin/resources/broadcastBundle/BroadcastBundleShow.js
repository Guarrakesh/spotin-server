import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux'; // eslint-disable-line
import {
  Show,
  CardContentInner,
  CardActions,
  EditButton,
  showNotification,
  UPDATE,
  DeleteButton,
  ReferenceFieldController,
   // ReferenceInputController,
} from 'react-admin';

import { Typography,
  Chip,
  Table,
  TableCell, TableRow, TableHead, TableBody,
  Button,
    Select,
    MenuItem,
} from "@material-ui/core";
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
        {record && record.published_at &&
        <Chip label={"Pubblicato " + moment(record.published_at).format('LLL')} color="primary"/>}
        <br/>
        <Typography variant="h6">
          <span>Programmazione dal </span>
          <Chip label={<DateTimeField record={record} source="start"/>}/>
          <span> al </span>
          <Chip label={<DateTimeField record={record} source="end"/>}/>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Broadcast</TableCell>
              <TableCell>Offerta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {record.broadcasts.map((broadcast, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={broadcast._id ? '/broadcasts/'+broadcast._id : "#"}>
                        <Typography variant="body2">
                          {broadcast.event.name}
                        </Typography>
                        <Typography variant="caption">
                          {moment(broadcast.event.start_at).format("DD/MM/YY [alle] HH:mm")}
                        </Typography>

                      </Link>
                    </TableCell>
                    <TableCell>
                        <Typography variant="caption">
                          {record.published
                              ? <ReferenceFieldController basePath="broadcasts"
                                                          record={broadcast} source="_id"
                                                          resource="broadcasts" reference="broadcasts">
                                {({ referenceRecord }) => (
                                    referenceRecord && referenceRecord.offer && referenceRecord.offer.value
                                        ? <Typography color="succes">
                                          {referenceRecord.offer.title || `-${referenceRecord.offer.value}%`}</Typography>
                                        : <Typography color="warning">Offerta non impostata</Typography>
                                )}
                              </ReferenceFieldController>
                              : <ReferenceFieldController basePath="businesses" record={record.business}
                                                          reference="businesses"
                                                          source="_id">
                                {({referenceRecord}) => referenceRecord && referenceRecord.offers ? (
                                    <Select>
                                      {referenceRecord.offers.map((offer, index) => (
                                              <MenuItem key={index} value={offer}>
                                                {offer.type === 0 ? offer.title : `-${offer.value}%`}
                                              </MenuItem>
                                          )
                                      )}
                                    </Select>
                                ) : null
                                }</ReferenceFieldController>

                          }
                        </Typography>
                    </TableCell>
                  </TableRow>
          ))}
          </TableBody>

        </Table>

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
  };
  return record ? (
      <Button disabled={record.published} color="primary" onClick={handleClick}>
        {record.published ? "Pubblicato" : "Pubblica"}</Button>
  ) : null;

});

PublishButton.propTypes = {
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
};
const BroadcastBundleShowActions = ({ basePath, data }) => (
    <CardActions>
      <DeleteButton/>
      <EditButton basePath={basePath} disabled record={data}/>
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