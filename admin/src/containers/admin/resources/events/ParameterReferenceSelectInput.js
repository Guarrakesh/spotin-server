import get from "lodash/get";
import PropTypes from "prop-types";
import React from "react";
import {required, SelectInput} from 'react-admin';
import {useFormState} from "react-final-form";
import referenceTypes from "./referenceTypes";

const ParameterReferenceSelectInput = props => {
  const state = useFormState();


  const field = get(state.values, props.source);

  if (field && field.type === "REFERENCE") {
    return (
        <SelectInput  validate={required()} {...props} fullWidth label="Reference Entity" source={`${props.source}.reference`} choices={
          referenceTypes
        }/>
    )
  }

  return null;
};
ParameterReferenceSelectInput.propTypes = {
  index: PropTypes.number,
  source: PropTypes.string,

}

export default ParameterReferenceSelectInput;
