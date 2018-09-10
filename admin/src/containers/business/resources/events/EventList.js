import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, NumberField} from 'react-admin';
import ReactTable from 'react-table'; //eslint-disable-line
import PropTypes from 'prop-types';
import List from 'business/views/list/List';
import { VersionedImageField } from '../../components/fields/VersionedImageField';



const EventList = (props) => (
  <List {...props}>
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
        return ({
          competitionImage:  <VersionedImageField
            record={data[id]} source="competition.image_versions"
            imgClassName={classes.pictureImg}
            minSize={{width: 128, height: 128}}/>,
          name: <TextField record={data[id]} source="name"/>,
          spots: <NumberField record={data[id]} source="spots"/>,

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
