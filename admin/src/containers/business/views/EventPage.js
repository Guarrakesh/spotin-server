/* eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { whithStyles } from '@material-ui/core/styles';

import {Card, CardHeader, CardIcon, CardBody} from 'business/components';
import { ShowController } from 'react-admin';
import styles from "business/assets/jss/material-dashboard-pro-react/views/eventPageStyle";

import { VersionedImageField } from 'business/components/fields/VersionedImageField';

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
  record,
  resource,
  title,
  version,
  ...rest
}) => {
  return (
    <div className={classnames('show-page', className)}
      {...sanitizeRestProps(rest)}>
        <Card>
          <CardHeader>
            <CardIcon className={classes.eventCardIcon}>
              <VersionedImageField
               record={record} source="competition.image_versions"
               minSize={{width: 32, height: 32}}/>
            </CardIcon>
          </CardHeader>
        </Card>

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
}

const EventPage = props => (
  <ShowController {...props}>
    {controllerProps => <EventView {...props} {...controllerProps}/>}
  </ShowController>
)
EventPage.propTypes = {

    children: PropTypes.element,
    className: PropTypes.string,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

export default EventPage;
