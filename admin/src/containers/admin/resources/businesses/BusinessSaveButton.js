import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { omit } from 'lodash';
import {
  SaveButton,
  crudCreate,
  crudUpdate
} from 'react-admin';

const normalizeBusinessHours = (businessHours) => {
  return [0,1,2,3,4,5,6].reduce(
      (acc, key) => {
        let day = businessHours[key];

        if (!day) {
          return  { ...acc, [key]: { openings: [] } };
        }
        let crossingDayClose = -1;
        const openings = day.openings.map(opening => {
          if (opening.close < opening.open) { // chiude dopo la mezzanotte
            crossingDayClose = opening.close;
          }
          return opening;
        });
        day.openings = openings;
        if (crossingDayClose > -1) day.crossing_day_close = crossingDayClose;
        return { ...acc, [key]: day }
      }
      , {})
};

const save = (values, basePath, redirectTo, isNew = true, previousData) => {

  const newValues = omit({ ...values, business_hours: normalizeBusinessHours(values.business_hours)},
      ['id','_id']);
console.log(redirectTo);
  return isNew ? crudCreate('businesses', newValues , basePath, redirectTo)
      : crudUpdate('businesses', values.id , newValues, previousData , basePath, redirectTo)
};
class BusinessSaveButton extends React.Component {

  static propTypes = {
    save: PropTypes.func,
    isNew: PropTypes.bool,
    basePath: PropTypes.string,
    handleSubmit: PropTypes.func,
    redirect: PropTypes.string,
    previousData: PropTypes.object,
  };
  handleClick = () => {
    const { basePath, handleSubmit, redirect, isNew = true, previousData} = this.props;
    console.log(redirect);
    return handleSubmit(values => {
      this.props.save(values, basePath, redirect, isNew, previousData);
    })
  };
  render() {
    return (<SaveButton
        {...this.props}
        handleSubmitWithRedirect={this.handleClick}

    />)
  }
}

export default connect(
    undefined,
    { save }
)(BusinessSaveButton);