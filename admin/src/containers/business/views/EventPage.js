/* eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {withStyles} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import {get} from "lodash";
import {Card, CardHeader, CardIcon, CardBody, GridContainer, GridItem } from "business/components";
import {ShowController, ReferenceField} from "react-admin";
import styles from "business/assets/jss/material-dashboard-pro-react/views/eventPageStyle";
import {VersionedImageField} from "business/components/fields/VersionedImageField";
import moment from 'moment';

import EventPublishForm from 'business/components/EventPublishForm';



const sanitizeRestProps = ({
  actions,
  title,
  children,
  className,
  crudGetOne,
  id,
  data,
  isLoading,
  resource,
  hasCreate,
  hasEdit,
  hasList,
  hasShow,
  translate,
  version,
  match,
  location,
  history,
  options,
  locale,
  permissions,
  ...rest
}) => rest;

export const EventView = ({
  basePath,
  children,
  className,
  classes,
  record,
  resource,
  title,
  version,
  ...rest
}) => {
  if (!record) return null;

  const date = moment(record.start_at).format("D MMM YYYY");
  const time = moment(record.start_at).format("HH:mm");
  return (
    <div className={classnames('show-page', className)}
         {...sanitizeRestProps(rest)}>
      <GridContainer>
        <GridItem xs={12} sm={12}>
          <Card>
            <CardHeader className={classes.eventCardHeader}>

              <CardIcon className={classes.eventCardIcon}>
                <ReferenceField basePath={basePath} record={record} reference="competitions" source="competition">
                  <VersionedImageField
                    record={record} source="image_versions"
                    minSize={{width: 128, height: 128}} />
                </ReferenceField>
              </CardIcon>

              <ReferenceField linkType={false} basePath={basePath} record={record} reference="competitions" source="competition">
                <EventName event={record} classes={classes}/>
              </ReferenceField>

            </CardHeader>
            <CardBody className={classes.eventCardBody}>
              <div className={classes.eventDateTime}>
                <span className={classes.eventDate}>{date}</span>
                <span className={classes.eventTime}>{time}</span>
              </div>
              <div className={classes.eventDesc}>
                {record.description}
              </div>
            </CardBody>
          </Card>

        </GridItem>
        <GridItem xs={12} sm={12}>
          { React.cloneElement( <EventPublishForm/>, {record, basePath, event, classes})}
        </GridItem>
      </GridContainer>
    </div>
  )
}


EventView.propTypes = {
  basePath: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  resource: PropTypes.string,
  classes: PropTypes.object
}

const EventPage = props => (
  <ShowController {...props}>
    {controllerProps => <EventView {...props} {...controllerProps}/>}
  </ShowController>
)
EventPage.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.element,
  className: PropTypes.string,
  id: PropTypes.any.isRequired,
  resource: PropTypes.string.isRequired,
  title: PropTypes.any,
};

export default withStyles(styles)(EventPage);
