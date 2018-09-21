import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';
import Nouislider from "react-nouislider";
import { Field } from 'redux-form'; // eslint-disable-line

const sliderRender = ({input,...props, noUiProps}) => {

  return (
    <span>

  <Nouislider
    step={5}
    connect={[true, false]}
    tooltips={true}

    start={input.value || 5}
    range={{
      min: 5,
      max: 100}}
    onChange={input.onChange}
    value={props.value}
    {...props}
    {...noUiProps}
  />
  </span>
  );
};

sliderRender.propTypes = {

  value: PropTypes.string,
  input: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.string,
  noUiProps: PropTypes.object,
};
const SliderInput = ({source, label, className, noUiProps, ...props}) => (
  <FormControl className={className}>
    {label && <InputLabel>{label}</InputLabel>}
    <Field name={source} label={label} component={sliderRender} noUiProps={noUiProps} {...props} />
  </FormControl>
);

SliderInput.propTypes = {
  label: PropTypes.string,
  source: PropTypes.string,
  noUiProps: PropTypes.object,
  className: PropTypes.string,
}
export default SliderInput;

