/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import {Grid, withStyles} from "@material-ui/core";
import {
  CardContentInner,
  FormInput, getDefaultValues,
  REDUX_FORM_NAME,
  ReferenceInput,
  AutocompleteInput
} from 'react-admin';
import {DateTimeInput} from '../../components/DateTimeInput';
import businessInputValueMatcher from '../helpers/businessInputValueMatcher';
const styles = {
  inlineBlock: { display: 'inline-block', marginRight: '1rem'}
};


const BroadcastBundleCreateForm
    = withStyles(styles)(({

                            basePath,
                            record,
                            redirect,
                            resource,
                            save,
                            form,
                            saving,
                            initialValues,
                            classes,
                            ...rest,
                          }) => {

  return (
      <form {...rest}>
        <CardContentInner>
          <Grid container spacing={8}>
            <Grid item xs={8}>
              <p>Periodo di riferimento</p>
              <Grid container spacing={24}>
                <Grid item xs={6}>

                  <FormInput
                      basePath={basePath}
                      input={
                        <DateTimeInput
                            formClassName={classes.inlineBlock}
                            source="start"/>}
                      record={record}

                      label="Dal"
                      resource={resource}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormInput
                      basePath={basePath}
                      input={<DateTimeInput
                          formClassName={classes.inlineBlock}
                          source="end"/>}
                      label="al"
                      record={record}
                      resource={resource}
                  />

                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <p>Business</p>
              <FormInput basePath={basePath}
                         input={
                           <ReferenceInput reference="businesses" source="business">
                             <AutocompleteInput
                                 optionText="name"
                                 inputValueMatcher={businessInputValueMatcher}
                                 source="name"/>
                           </ReferenceInput>
                         }
                         label="Business"
                         record={record}
                         resource={resource}
              />
            </Grid>
          </Grid>
          <FormInput/>
        </CardContentInner>
      </form>


  )
});



BroadcastBundleCreateForm.propTypes = {
  basePath: PropTypes.string,
  record:   PropTypes.object,
  redirect: PropTypes.string,
  resource: PropTypes.string,
  save:     PropTypes.func,
};

const enhanced = compose(
    connect((state, props) => ({
      form: props.form || REDUX_FORM_NAME,
      initialValues: getDefaultValues(state, props),
      saving: props.saving || state.admin.saving,

    })),
    reduxForm({
      destroyOnUnmount: false,
      enableReinitialize: true,
      keepDirtyOnReinitialize: true
    })
);

export default enhanced(BroadcastBundleCreateForm);