import React from 'react';
/* eslint-disable */
import Nouislider from 'react-nouislider';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from "@material-ui/core/FormControl";

import {Card, CardHeader, CardIcon, CardBody} from 'business/components';

import TurnedIn from "@material-ui/icons/TurnedIn";





const EventPublishForm = ({classes}) => {
  return (
     <Card>
       <CardHeader color="primary" icon>
         <CardIcon color="primary">
           <TurnedIn/>
         </CardIcon>
         <h4 className={classes.cardIconTitle}>Pubblica evento</h4>
       </CardHeader>
       <CardBody>
         <GridItem>

         </GridItem>
         <GridItem>

         </GridItem>
       </CardBody>
     </Card>

  )


};

export default EventPublishForm;
