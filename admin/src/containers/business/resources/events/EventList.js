import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Responsive, SimpleList, ReferenceField } from 'react-admin';
import ReactTable from 'react-table'; //eslint-disable-line
import PropTypes from 'prop-types';
import List from 'business/views/list/SimpleList';
import moment from 'moment';
import SpotIcon from 'business/assets/img/SpotinIcon-outline';
import { dangerColor } from 'business/assets/jss/material-dashboard-pro-react';
import Button from 'business/components/material-ui/CustomButtons/Button';
import { Link } from 'react-router-dom';

import { VersionedImageField } from '../../components/fields/VersionedImageField';



/* eslint-disable */
const EventList = (props) => (
  <List title={"Eventi in programma"}  {...props}>
    <Responsive
      medium={<EventTable/>}
      small={ <SimpleList
        primaryText={record => <VersionedImageField
          record={record} source="competition.image_versions"
          minSize={{width: 32, height: 32}}/>}

        secondaryText={record => record.name}
        tertiaryText={record => {
          const dateTime = moment(record.start_at).locale('').format('D MMM - HH:mm').toUpperCase();
          return dateTime;
        }}
      />}
    />
  </List>



);

/**
 *
 * @param record
 * Il tasto crea un link alla pagina di acquisto dell'evento (che sarebbe la creazione di una risorsa Braodcast)
 * e si premura di passare il parametro event
 * come prefill in CreateBroadcast (tutto sarà gestito da CreateController di react-admin)
 */
const CreateBroadcastButton = ({record}) => (
  <Link
    to={{
      pathname: '/broadcasts/create',
      state: { record: { event: record }}
    }}
    >
    <Button color="primary" simple>Acquista</Button>
  </Link>

)

const styles = {
  pictureImg: {
    width: '32px',
    height: 'auto'
  },
  idCell: { width: '10%'},
  pictureCell: { width: '10%'},
  spotCell: {
    fontWeight: '500',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

    "& svg " : {
      marginLeft: '5px',
    }
  },
  competitionCell: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: 500,
    "& img": {
      marginRight: '16px'
    }
  }
};


const CompetitionCell = ({classes, record,  ...rest}) => (
  <div className={classes.competitionCell}>
    <VersionedImageField
      record={record}
      source="image_versions"
      imgClassName={classes.pictureImg}
      minSize={{width: 128, height: 128}}/>
      <TextField source="name"/>
  </div>
);

const EventTable = withStyles(styles)(
  ({  ids,
    data,
    classes,
    basePath}) => {


    return (
      <ReactTable
        data={

          ids.map(id => {
            const dateTime = moment(data[id].start_at).locale('').format('D MMM - HH:mm').toUpperCase();
            return ({
              competitionImage:
                <ReferenceField basePath={basePath} record={data[id]} reference="competitions" source="competition">
                  <CompetitionCell classes={classes} />
                </ReferenceField>,


              name: <TextField record={data[id]} source="name"/>,
              date: <span>{dateTime}</span>,
              spots: <div className={classes.spotCell}>{data[id].spots}<SpotIcon width="15" height="15" color={dangerColor}/></div>,
              actions: <CreateBroadcastButton record={data[id]}/>

            })
          })
        }
        columns={[
          {
            Header: 'Competizione',
            accessor: 'competitionImage'
          },
          {
            Header: 'Nome',
            accessor: 'name'
          },
          {
            Header: 'Data',
            accessor: 'date'
          },
          {
            Header: 'Spots',
            accessor: 'spots',
            headerStyle: {
              textAlign: 'right'
            },
            style: {'textAlign': 'right'}
          },
          {
            Header: '',
            resizable: false,
            sortable: false,
            filterable: false,
            accessor: 'actions',
            style: {'textAlign': 'right'}
          }
        ]}
        defaultPageSize={10}
        showPaginationTop
        showPaginationBottom={false}
        className="-highlight"

      />);

  });
EventTable.defaultProps = {
  ids: [],
  data: {},
};
EventTable.propTypes = {
  ids: PropTypes.array,
  data: PropTypes.object,
  basePath: PropTypes.string
};
export default EventList;
