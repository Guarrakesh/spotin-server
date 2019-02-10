import React from 'react';
import {
  Edit
} from 'react-admin';

/* eslint-disable */
const BroadcastBundleTitle = ({ record }) => {
  return <span>Bundle per {record.business.name} dal {record.start} al {record.end}</span>
}
/* eslint-enable */

 const BroadcastBundleEdit = props => {

  return (
      <Edit title={BroadcastBundleTitle} {...props}>

      </Edit>
  )
};

export default BroadcastBundleEdit;