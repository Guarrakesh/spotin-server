import withStyles from '@material-ui/core/styles/withStyles'
import {push} from 'connected-react-router';
import React from 'react';
import {Datagrid, EditButton, List, TextField} from 'react-admin';
import {connect} from 'react-redux';
import compose from 'recompose/compose';

const styles = {
  drawerContent: {
    width: 300
  }
};
/* eslint-disable */
const NumberOfFields = ({ record }) => (
    <span>{Object.keys(record.parameters).length}</span>
);


class EventList extends React.Component {


  handleClose = () => {
    this.props.push('/systemevents');
  };

  render() {


    return (
        <React.Fragment>

          <List title="System Events" {...this.props} >
            <Datagrid>
              <TextField source="id"/>
              <TextField label="Name" source="name"/>
              <TextField label="Slug" source="slug"/>
              <NumberOfFields label="# Params"/>
              <EditButton/>
            </Datagrid>
          </List>

        </React.Fragment>
    )
  };

}
export default compose(
    connect(
        undefined, { push }
    ),



    withStyles(styles)

)(EventList);
