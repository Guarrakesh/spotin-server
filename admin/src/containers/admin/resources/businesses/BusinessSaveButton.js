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

const save = (values, basePath, redirectTo, isNew = true) => {
  const newValues = omit({ ...values, business_hours: normalizeBusinessHours(values.business_hours)},
      ['id','_id']);
  return isNew ? crudCreate('businesses', newValues , basePath, redirectTo)
      : crudUpdate('businesses', values.id , newValues, newValues , basePath)
};
class BusinessSaveButton extends React.Component {

  static propTypes = {
    save: PropTypes.func,
    isNew: PropTypes.bool,
    basePath: PropTypes.string,
    handleSubmit: PropTypes.func,
    redirectTo: PropTypes.string
  };
  handleClick = () => {
    console.log("aaa", this.props);
    const { basePath, handleSubmit, redirectTo, isNew = true} = this.props;
    return handleSubmit(values => {
      this.props.save(values, basePath, redirectTo, isNew);
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