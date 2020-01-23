import Button from "@material-ui/core/Button/Button";
import PropTypes from 'prop-types';
import React from 'react';
import {Create, SaveButton, SimpleForm, TextInput, Toolbar, translate} from 'react-admin';

const EventCreate = ({ onCancel, ...props }) => {

  const EventCreateToolbar = translate(({ onCancel, translate, ...props }) => (
      <Toolbar {...props}>
        <SaveButton />
        <Button onClick={onCancel}>{translate('ra.action.cancel')}</Button>
      </Toolbar>
  ));
  return (
      <Create title=" " {...props}>
        <SimpleForm toolbar={<EventCreateToolbar onCancel={onCancel}/>}>

          <TextInput source="name" label="Name"/>
          <TextInput source="slug" label="slug"/>

        </SimpleForm>
      </Create>
  )

};

EventCreate.propTypes = {
  onCancel: PropTypes.func,
}


export default EventCreate;
