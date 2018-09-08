import React from 'react';
import { List, TextField, NumberField} from 'react-admin';
import ReactTable from 'react-table'; //eslint-disable-line
import PropTypes from 'prop-types';

const EventList = (props) => (
  <List {...props}>
    <EventTable/>
  </List>



);


const EventTable = ({ids, data}) => {
  console.log(ids, data);
  return (
  <ReactTable
    data={
      ids.map(id => ({
        id: id,
        name: <TextField record={data[id]} source="name"/>,
        spots: <NumberField record={data[id]} source="spots"/>,

      }))
    }
    columns={[
      {
        Header: 'Id',
        accessor: 'id'
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
    className="-striped -highlight"

  />);

}
EventTable.defaultProps = {
  ids: [],
  data: {},
}
EventTable.propTypes = {
  ids: PropTypes.array,
  data: PropTypes.object,
  basePath: PropTypes.string
};
export default EventList;
