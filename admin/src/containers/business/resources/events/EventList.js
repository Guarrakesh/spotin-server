import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from 'react-admin';
import ReactTable from 'react-table'; //eslint-disable-line
import PropTypes from 'prop-types';
import List from 'business/views/list/SimpleList';
import moment from 'moment';
import { VersionedImageField } from '../../components/fields/VersionedImageField';




const EventList = (props) => (
  <List title={"Eventi in programma"} {...props}>
    <EventTable/>
  </List>



);


const styles = {
  pictureImg: {
    width: '32px',
    height: 'auto'
  },
  idCell: { width: '10%'},
  pictureCell: { width: '10%'}
};

const EventTable = withStyles(styles)(({ids, data, classes}) => {


  return (
  <ReactTable
    data={

      ids.map(id => {
        const dateTime = moment(data[id].start_at).locale('').format('d MMM - HH:mm').toUpperCase();
        return ({
          competitionImage:  <VersionedImageField
            record={data[id]} source="competition.image_versions"
            imgClassName={classes.pictureImg}
            minSize={{width: 128, height: 128}}/>,
          name: <TextField record={data[id]} source="name"/>,
          date: <span>{dateTime}</span>,
          spots: <TextField record={data[id]} source="spots"/>,


        })
      })
    }
    columns={[
      {
        Header: '',
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
        accessor: 'spots'
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
