/* eslint-disable */
import {Box, withStyles} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useCallback} from 'react';
import {
  AutocompleteInput,
  BooleanInput,
  FormDataConsumer,
  FormInput,
  FormWithRedirect,
  ReferenceInput,
  SaveButton,
  Toolbar,
  useCreate,
  useRedirect,
} from 'react-admin';
import {DateInput} from 'react-admin-date-inputs'
import {useForm, useFormState} from 'react-final-form';
//import businessInputValueMatcher from '../helpers/businessInputValueMatcher';

const styles = {
  inlineBlock: { display: 'inline-block', marginRight: '1rem'}
};

const required = value => (value || typeof value === 'number' ? undefined : 'Required');
const businessValidate = (value, allValues) => {
  if (!value && !allValues.bulkCreate) {
    return 'Business is required'
  }
};

const SaveBroadcastBundleButton = ({ handleSubmitWithRedirect, ...props}) => {


  const form = useForm();
  const values = useFormState();
  const handleClick = useCallback(() => {
    if (values.bulkCreate) {
      form.change('business', undefined);
    } else if (values.business) {
      form.change('bulkcreate', undefined);
    }
    handleSubmitWithRedirect('create');

  }, [form]);

  return <SaveButton {...props} handleSubmitWithRedirect={handleClick}/>
}
const BroadcastBundleCreateForm
    = withStyles(styles)((props) => {


  return (
      <FormWithRedirect {...props}
                        render={formProps => (
                            <form>
                              <Box p="1em">
                                <Box display="flex">
                                  <Box flex={2} mr="1em">

                                    <Typography variant="h6" gutterBottom>Periodo di riferimento</Typography>

                                    <Box display="flex">
                                      <Box flex={1} mr="0.5em">
                                        <DateInput

                                            validate={[required]}
                                            formClassName={props.classes.inlineBlock}
                                            source="start"/>
                                      </Box>
                                      <Box flex={1} ml="0.5em">
                                        <DateInput

                                            validate={[required]}
                                            formClassName={props.classes.inlineBlock}
                                            source="end"/>
                                      </Box>
                                    </Box>
                                    <Box mt="1em" />

                                    <Typography variant="h6" gutterBottom>Business</Typography>
                                    <BooleanInput source="bulkCreate" label="Crea per tutti i locali visibili sulla piattaforma"/>

                                    <FormDataConsumer>
                                      {({ formData }) => (formData && formData.bulkCreate) ? null : (
                                          <FormInput basePath={props.basePath}
                                                     translate={props.translate}

                                                     input={
                                                       <ReferenceInput

                                                           validate={[businessValidate]} reference="businesses" source="business">
                                                         <AutocompleteInput

                                                             optionText="name"

                                                             source="name"/>
                                                       </ReferenceInput>
                                                     }
                                                     label="Business"
                                                     record={props.record}
                                                     resource={props.resource}
                                          />
                                      )}
                                    </FormDataConsumer>

                                  </Box>


                                </Box>
                              </Box>
                              <Toolbar>
                                <Box display="flex" justifyContent="space-between" width="100%">
                                  <SaveBroadcastBundleButton
                                      saving={formProps.saving}
                                      handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                  />
                                </Box>
                              </Toolbar>

                            </form>
                        )}
      />


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



export default BroadcastBundleCreateForm
