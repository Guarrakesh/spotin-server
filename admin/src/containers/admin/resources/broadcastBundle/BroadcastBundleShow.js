import React, { useState } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import moment from 'moment';

import { push } from 'connected-react-router'; // eslint-disable-line
import {
  Show,
  CardContentInner,
  TopToolbar,
  EditButton,
  showNotification,
  UPDATE,
  DeleteButton,
  ReferenceField,
  FunctionField,
  Link,
  TextField,
  // ReferenceInputController,
} from 'react-admin';

import {
  Typography,
  Chip,
  Table,
  TableCell, TableRow, TableHead, TableBody,

  Button,
  Select,
  MenuItem,
  Icon,
  IconButton,
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
    = ({ record, onChangeBroadcasts}) => {

  const [ broadcasts, setBroadcasts ] = useState(record.broadcasts);


  const handleOfferChange = (broadcast, offer) => {
    const newBroadcasts = broadcasts.map(b =>
        b.event._id === broadcast.event._id ? { ...broadcast, offer } : b);

    setBroadcasts(newBroadcasts);
    onChangeBroadcasts(newBroadcasts);
  };
  const handleRemoveBroadcast = index => {
    const newBroadcasts = broadcasts.filter((_, i) => i !== index);
    setBroadcasts(newBroadcasts);
    onChangeBroadcasts(newBroadcasts);
  };

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
              {record && !record.published_at && <TableCell>#</TableCell>}
              <TableCell>Evento</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Competizione</TableCell>
              <TableCell>Offerta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {broadcasts.map((broadcast, index) => (
                <TableRow key={index}>
                  {record && !record.published_at && <TableCell width="50px">
                    <IconButton onClick={() => handleRemoveBroadcast(index)} color="primary"
                                aria-label="Rimuovi broadcast">
                      <Icon>remove</Icon>
                    </IconButton>
                  </TableCell>
                  }
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
                    {broadcast.event.sport &&
                    <Link to={`/sports/${broadcast.event.sport}`}>
                      <Typography variant="body2">
                      <ReferenceField reference="sports" basePath="/sports"
                                                record={broadcast.event} source="sport" resource="sports">
                        <TextField source="name" />
                      </ReferenceField>
                      </Typography>
                    </Link>
                    }
                  </TableCell>
                  <TableCell>
                    {broadcast.event.competition &&
                    <Link to={`/competitions/${broadcast.event.competition}`}>
                      <Typography variant="body2">
                        <ReferenceField basePath="/competitions" reference="competitions"
                                                  record={broadcast.event} source="competition" resource="competitions">
                          <TextField source="name" />
                        </ReferenceField>
                      </Typography>
                    </Link>
                    }
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {record.published
                          ? <ReferenceField linkType={false}
                                            basePath="/broadcasts"
                                                      record={broadcast} source="_id"
                                                      resource="broadcasts" reference="broadcasts">
                            <FunctionField render={({record: referenceRecord }) => (
                                referenceRecord && referenceRecord.offer && referenceRecord.offer.value
                                    ? <Typography color="success">
                                      {referenceRecord.offer.title || `-${referenceRecord.offer.value}%`}</Typography>
                                    : <Typography color="warning">Offerta non impostata</Typography>
                            )}/>
                          </ReferenceField>
                          : <ReferenceField  linkType={false}  basePath="/businesses" record={record.business}
                                                      reference="businesses"
                                                      source="_id">
                            <FunctionField render={referenceRecord => {


                              if (!broadcasts || !referenceRecord || !referenceRecord.offers) return null;
                              const selectedOffer = referenceRecord.offers.find(o => broadcast.offer && o._id === broadcast.offer._id)
                                  || referenceRecord.offers.find(o => o.isDefault) || undefined;


                              referenceRecord.offers.forEach((o) => {
                                if (o.isDefault && !broadcast.offer) {
                                  handleOfferChange(broadcast, o);
                                }
                              });
                              if ((referenceRecord.offers.length === 0 ||
                                    referenceRecord.offers.filter( o => o.isDefault).length === 0)
                                  && !broadcast.offer) {
                                handleOfferChange(broadcast, {})
                              }
                              return referenceRecord && referenceRecord.offers ? (
                                  <Select
                                      fullWidth
                                      inputProps={{ id: 'select-offer'}}
                                      onChange={(e) => handleOfferChange(broadcast, e.target.value)}
                                      value={selectedOffer}>
                                    {referenceRecord.offers.map((offer, index) => (
                                            <MenuItem key={index} value={offer}>
                                              {offer.type === 0 ? offer.title : `-${offer.value}%`}
                                            </MenuItem>
                                        )
                                    )}
                                  </Select>

                              ) : null
                            }}/>
                        </ReferenceField>

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
/* eslint-disable */
const PublishButton = connect(undefined, { showNotification, push })(({ push, record, showNotification, broadcasts }) => {

  const handleClick = () => {

    const updated = { ...record, broadcasts, published: true };

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
      <Button disabled={record.published || !broadcasts || broadcasts.length === 0} color="primary" onClick={handleClick}>
        {record.published ? "Pubblicato" : "Pubblica"}</Button>
  ) : null;

});

PublishButton.propTypes = {
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
};
const BroadcastBundleShowActions = ({ basePath, data, broadcasts }) => (
    <TopToolbar>
      <DeleteButton basePath={basePath} record={data} resource="broadcastbundles"/>
      <EditButton basePath={basePath} disabled record={data}/>
      <PublishButton record={data} broadcasts={broadcasts}/>
    </TopToolbar>
);
BroadcastBundleShowActions.propTypes = {
  basePath: PropTypes.string,
  data: PropTypes.object,
  broadcasts: PropTypes.array,
}
const BroadcastBundleShow = (props) => {
  const [broadcasts, setBroadcasts] = useState(props.broadcasts || []);

  const handleChangeBroadcasts = newBroadcasts => {
    setBroadcasts(newBroadcasts);
  };
  return (
      <Show actions={<BroadcastBundleShowActions broadcasts={broadcasts}/>}
            title={<BroadcastBundleTitle/>} {...props}>
        <BroadcastBundleShowView onChangeBroadcasts={handleChangeBroadcasts}/>
      </Show>
  )
};

BroadcastBundleShowView.propTypes = {
  record: PropTypes.object,
  onChangeBroadcasts: PropTypes.func,

};
export default BroadcastBundleShow;
