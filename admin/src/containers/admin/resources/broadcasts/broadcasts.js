import React  from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  ListItemText,

  ListSubheader,
  List as MuiList,
  ListItem, Card, withStyles, CardHeader, CardContent, Typography } from "@material-ui/core";
import moment from 'moment';
import { List, Datagrid, TextField, ReferenceField, Create, EditButton, ReferenceInput, SimpleForm, TextInput, NumberInput, AutocompleteInput,
  RadioButtonGroupInput, Edit, Filter, DisabledInput, LongTextInput,
  DateField, Link } from 'react-admin';
import get from 'lodash/get';

import EventAutocompleteInput from '../sportevents/EventAutocompleteInput';
import { DateTimeInput } from '../../components/DateTimeInput';
import businessInputValueMatcher from '../helpers/businessInputValueMatcher';


const ReservationCountField = ({record}) => (
    <span>{get(record, 'reservations').length}</span>
);
ReservationCountField.propTypes = {
  record: PropTypes.object,
};

const asideStyle = theme => ({
  card: {
    margin: theme.spacing.unit
  }
});

const BroadcastEditAside = withStyles(asideStyle)(({ record, classes }) => (
    <div>
      {record && (
          <React.Fragment>
            <MuiList subheader={<ListSubheader>Dettagli</ListSubheader>}>
              <ListItem variant="body1">
                <ListItemText primary="Data aggiunta"
                              secondary={ moment(record.created_at).format('D/M/Y H:m') }
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ultima modifica"
                              secondary={ moment(record.updated_at).format('D/M/Y H:m') }
                />
              </ListItem>
              {record.bundle &&
              <ListItem>
                <Chip
                    label="Creato con un bundle"
                    variant="body1"
                />
              </ListItem>
              }

            </MuiList>
            <Card className={classes.card}>
              <CardHeader title="Prenotazioni"/>
              { record.reservations.length > 0 ?
                  <CardContent>
                    <Link to={`/reservations/${record.reservations[record.reservations.length-1]._id}/show`}>
                      <Typography>
                        Ultima prenotazione:<br/>
                        {moment(record.reservations[record.reservations.length-1].created_at).format('DD/MM/Y [alle] H:mm')}
                      </Typography>
                    </Link>

                  </CardContent>
                  :
                  <CardContent>
                    <Typography color="textSecondary">Nessuna prenotazione</Typography>
                  </CardContent>
              }
            </Card>
            <Card className={classes.card}>
              <CardHeader title="Cheers"/>
              <ListItem variant="body1">
                <ListItemText primary="Total cheers" secondary={record.cheers ? record.cheers.total : 0} />
              </ListItem>

              {record.cheers && record.cheers.home &&
              <ListItem variant="body1">
                <ListItemText primary="Home cheers" secondary={record.cheers.home}/>
              </ListItem>
              }
              {record.cheers && record.cheers.guest &&
              <ListItem variant="body1">
                <ListItemText primary="Guest cheers" secondary={record.cheers.guest}/>
              </ListItem>
              }
              {record.cheers && record.cheers.other.length > 0 &&
              <ListItem variant="body1">
                <ListItemText primary="Other" secondary={record.cheers.other.join(',')}/>
              </ListItem>
              }

            </Card>
          </React.Fragment>
      )}
    </div>
));
BroadcastEditAside.propTypes = {
  record: PropTypes.object
};

const BroadcastFilter = (props) => (
    <Filter {...props}>
      <ReferenceInput reference="events" source="event">
        <EventAutocompleteInput />
      </ReferenceInput>
      <ReferenceInput reference="businesses" source="business">
        <AutocompleteInput label="Locale" source="name" />
      </ReferenceInput>

    </Filter>
);
export const BroadcastList = (props) => (
    <List {...props} filters={<BroadcastFilter/>}>
      <Datagrid>

        <ReferenceField reference="events" source="event">
          <TextField source="name"/>
        </ReferenceField>
        <ReferenceField reference="businesses" source="business">
          <TextField source="name"/>
        </ReferenceField>
        <ReferenceField reference="events" source="event" label="Event date">
          <DateField source="start_at" showTime/>
        </ReferenceField>
        <TextField>
        </TextField>
        <ReservationCountField source="reservations" label="Prenotazioni"/>
        <EditButton/>
      </Datagrid>
    </List>
);




export const BroadcastCreate = (props) => (
    <Create {...props}>
      <SimpleForm>


        <EventAutocompleteInput/>

        <ReferenceInput reference="businesses" source="business">
          <AutocompleteInput
              optionText="name"
              inputValueMatcher={businessInputValueMatcher}
              source="name"/>
        </ReferenceInput>
        {/*<NumberInput source="newsfeed"/>*/}

        <TextInput
            options={{fullWidth: true}}
            source="offer.title" label="Titolo offerta"/>

        <LongTextInput
            source="offer.description" label="Descrizione offerta"/>




        <RadioButtonGroupInput
            parse={v => parseInt(v, 10)}
            label="Tipo offerta" source="offer.type" choices={[
          {id: 0, name: 'Prezzo fisso'},
          {id: 1, name: 'Sconto in percentuale'},
        ]}/>


        <NumberInput source="offer.value" label="Valore offerta"/>
        <DateTimeInput source="start_at"
                       label="Inizio prenotazioni (Default 2 settimane prima)"
                       options={{ format: "dd///MM/YYYY, HH:mm:ss"}}/>
        <DateTimeInput source="end_at"
                       label="Fine prenotazioni (Default 3 ore dopo)"
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>
      </SimpleForm>
    </Create>
);


export const BroadcastEdit = (props) => (
    <Edit
        aside={<BroadcastEditAside/>}
        {...props}>
      <SimpleForm >
        <DisabledInput source="_id"/>
        <EventAutocompleteInput/>

        <ReferenceInput reference="businesses" source="business">
          <AutocompleteInput source="name"
                             inputValueMatcher={businessInputValueMatcher}
                             optionText="name"/>
        </ReferenceInput>
        <NumberInput source="newsfeed"/>

        <TextInput
            options={{fullWidth: true}}
            source="offer.title" label="Titolo offerta "/>



        <LongTextInput
            source="offer.description" label="Descrizione offerta"/>

        <RadioButtonGroupInput
            parse={v => parseInt(v, 10)}
            label="Tipo offerta" source="offer.type" choices={[
          {id: 0, name: 'Prezzo fisso'},
          {id: 1, name: 'Sconto in percentuale'},
        ]}/>


        <NumberInput source="offer.value" label="Valore offerta"/>
        <DateTimeInput source="start_at"

                       label="Inizio prenotazioni "
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>
        <DateTimeInput source="end_at"
                       label="Fine prenotazioni"
                       options={{ format: "dd/MM/YYYY, HH:mm:ss"}}/>




      </SimpleForm>
    </Edit>
);
