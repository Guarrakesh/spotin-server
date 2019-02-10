import React from 'react';
/* eslint-disable*/
import { List, Datagrid, TextField, ShowButton } from 'react-admin';
import get from 'lodash/get'
import { Link } from 'react-router-dom';
import Check from '@material-ui/icons/Check';
import Clock from '@material-ui/icons/Timer';
import DateTimeField from '../../components/DateTimeField';


const BusinessTextField = (props) => (
    <Link to={`businesses/${get(props.record,props.idSource)}`}><TextField {...props}/></Link>
);

const BundleStatusField = props => {
  const value = get(props.record, props.source);
  return value ? (<span><Check color="secondary"/>Pubblicato</span>) : <span><Clock color="primary"/>In attesa</span>
}
const BroadcastBundleList = props => {

  return (
      <List hasShow {...props}>
        <Datagrid>
          <DateTimeField source="start"/>
          <DateTimeField source="end"/>
          <BusinessTextField idSource="business._id" source="business.name" label="Business" reference="businesses" />
          <BundleStatusField source="published_at" label="Pubblicato"/>
          <ShowButton/>
        </Datagrid>

      </List>
  )
};

export default BroadcastBundleList;