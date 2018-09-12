import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { whithStyles } from '@material-ui/core/styles';

import {Card, CardHeader, CardIcon CardBody} from 'business/components';
import { ShowController } from 'ra-core';
import styles from "business/assets/jss/material-dashboard-pro-react/views/eventPageStyle";


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

export const EventPage = ({
  basePath,
  children,
  className,
  record,
  resource,
  title,
  version
  ...rest
}) => {
  return (
    <div className={classnames('show-page', className)}
      {...sanitizeRestProps(rest)}
        <Card>
          <CardHeader>
            <CardIcon
          </CardHeader>
        </Card>

    </div>
  )
}
