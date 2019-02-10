import React from 'react';

import { Create } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';


import BroadcastBundleCreateForm from './BroadcastBundleCreateForm';

const styles = {

};

const BroadcastBundleCreate = withStyles(styles)(({...props}) => {
  return (
      <Create { ...props}>

        <BroadcastBundleCreateForm/>
      </Create>


  )
});

export default BroadcastBundleCreate;
