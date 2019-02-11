/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import {Grid, withStyles} from "@material-ui/core";
import {DateInput, DateTimeInput} from '../../components/DateTimeInput';
import businessInputValueMatcher from '../helpers/businessInputValueMatcher';
import moment from 'moment';
import {
  CardContentInner,
  FormInput, getDefaultValues,
  REDUX_FORM_NAME,
  ReferenceInput,
  AutocompleteInput,
  Toolbar,
  SaveButton,

} from 'react-admin';

const styles = {
  inlineBlock: { display: 'inline-block', marginRight: '1rem'}
};

const required = value => (value || typeof value === 'number' ? undefined : 'Required')
const BroadcastBundleCreateForm
    = withStyles(styles)(({

                            pristine,
                            invalid,
                            submitOnEnter,
                            handleSubmit,
                            basePath,
                            record,

                            resource,
                            save,
                            form,
                            saving,
                            initialValues,
                            classes,
                            translate,
                            ...rest,
                          }) => {

  const handleSubmitWithRedirect = (redirect = redirect) =>
      handleSubmit(values => save(values, redirect));
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
                        <DateInput

                            validate={[required]}
                            options={{ format: "dd/MM/YYYY"}}
                            formClassName={classes.inlineBlock}
                            source="start"/>}
                      record={record}

                      label="Dal"
                      resource={resource}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormInput
                      translate={translate}
                      basePath={basePath}
                      input={<DateInput

                          validate={[required]}
                          options={{ format: "dd/MM/YYYY"}}
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
                         translate={translate}
                         input={
                           <ReferenceInput

                               validate={[required]} reference="businesses" source="business">
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
          <Toolbar>
            <SaveButton basePath={basePath}
                        label="Crea bundle"
                        handleSubmitWithRedirect={handleSubmitWithRedirect}
                        handleSubmit={handleSubmit}
                        invalid={invalid}
                        pristine={pristine}
                        redirect={"show"}
                        saving={saving}
                        submitOnEnter={submitOnEnter}
            />

          </Toolbar>
        </CardContentInner>
      </form>


  )
});


BroadcastBundleCreateForm.defaultProps = {
  submitOnEnter: true,
  toolbar: <Toolbar />,
};
BroadcastBundleCreateForm.propTypes = {
  basePath: PropTypes.string,
  record:   PropTypes.object,

  resource: PropTypes.string,
  save:     PropTypes.func,
};

const enhanced = compose(
    connect((state, props) => ({
      form: props.form || REDUX_FORM_NAME,
      initialValues: {
        start: moment().add(1, 'day').startOf('day'),
        end: moment().add(8,'days').endOf('day'),

      },
      saving: props.saving || state.admin.saving,

    })),
    reduxForm({
      destroyOnUnmount: false,
      enableReinitialize: true,
      keepDirtyOnReinitialize: true
    })
);

export default enhanced(BroadcastBundleCreateForm);