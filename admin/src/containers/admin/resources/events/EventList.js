import CardActions from "@material-ui/core/CardActions/CardActions";
import Drawer from "@material-ui/core/Drawer/Drawer";
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react';
import {CreateButton, Datagrid, EditButton, List, TextField} from 'react-admin';
import {connect} from 'react-redux';

import {Route, withRouter} from 'react-router';// eslint-disable-line
import {push} from 'react-router-redux';
import compose from 'recompose/compose';
import EventCreate from './EventCreate';

const styles = {
  drawerContent: {
    width: 300
  }
};
/* eslint-disable */
const NumberOfFields = ({ record }) => (
    <span>{Object.keys(record.parameters).length}</span>
);

const EventListActions = ({ basePath }) => (
    <CardActions>
      <CreateButton basePath={basePath}/>
    </CardActions>
)
class EventList extends React.Component {


  handleClose = () => {
    this.props.push('/systemevents');
  };

  render() {
    const classes = this.props.classes;

    return (
        <React.Fragment>

          <List title="System Events" {...this.props} actions={<EventListActions/>}>
            <Datagrid>
              <TextField source="id"/>
              <TextField label="Name" source="name"/>
              <TextField label="Slug" source="slug"/>
              <NumberOfFields label="# Params"/>
              <EditButton/>
            </Datagrid>
          </List>

          <Route
              path="/systemevents/create">
            {({match, ...rest}) => {
              console.log(rest);
              return (

                  <Drawer
                      open={!!match}
                      anchor="right"
                      onClose={this.handleClose}
                  >
                    <EventCreate className={classes.drawerContent}
                                 onCancel={this.handleClose}
                                 {...this.props}
                    />
                  </Drawer>
              )
            }
            }
          </Route>

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
