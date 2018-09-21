import React from 'react';

import { RadioButtonGroupInput } from 'react-admin';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

import customCheckboxRadioSwitch from "business/assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";


const SwitchInput = ({classes, tooltip, ...rest}) => {

  const switchInput = (<BooleanInput {...rest} options={
    {
      classes: {
        switchBase: classes.switchBase,
        checked: classes.switchChecked,
        icon: classes.switchIcon,
        iconChecked: classes.switchIconChecked,
        bar: classes.switchBar
      }
    }}
  />)
  if (!tooltip)
    return switchInput;

  if (typeof tooltip === "string")
    return <Tooltip title={tooltip}>{switchInput}</Tooltip>

  return <tooltip.type>{switchInput}</tooltip.type>
}

SwitchInput.defaultProps = {
  tooltip: null,
}
SwitchInput.propTypes = {
  classes: PropTypes.object,
  tooltip: PropTypes.oneOf([PropTypes.string, PropTypes.element])

};

export default withStyles(customCheckboxRadioSwitch)(SwitchInput);


