import moment from "moment";
import PropTypes from "prop-types";
import React, {useCallback} from "react";
import {SaveButton} from 'react-admin';
import {useForm, useFormState} from "react-final-form";


const normalizeMinutes = minutes => {
  // Normalizza il valore nel range [0,1440].
  let parsed = minutes;
  if (minutes < 0) {
    parsed = 1440 - Math.abs(parsed);
  } else if (minutes > 1440) {
    parsed = minutes - 1440;
  }
  return parsed;
};

const businessDayInputParser = (value => {
  let hour, minute;

  if (typeof value === "number") {
    return value;
  } else if (value.getDate !== undefined) {
    // if its a date object, convert to moment
    value = moment(value);
  }

  if (value instanceof moment) {

    hour = parseInt(value.hour(), 10);
    minute = parseInt(value.minute(), 10);
  } else {
    hour = parseInt(value.split(":")[0], 10);
    minute = parseInt(value.split(":")[1], 10);
  }

  const date = new Date();
  let parsed = hour * 60 + minute + date.getTimezoneOffset(); //Restituisce i minuti
  return normalizeMinutes(parsed);
});


const destringifyKeys = values => {
  console.log(values);
  const newObj = [0, 1, 2, 3, 4, 5, 6].reduce((result, key) => {
    result[key] = values[`key${key}`];
    return result
  }, {});
  console.log(newObj);
  return newObj;
}

const normalizeBusinessHours = (businessHours) => {
  return [0,1,2,3,4,5,6].reduce(
      (acc, key) => {
        let day = businessHours[key];

        if (!day) {
          return  { ...acc, [key]: { openings: [] } };
        }
        let crossingDayClose = -1;

        const openings = day.openings.map(unparsed => {
          const opening = {
            open: businessDayInputParser(unparsed.open),
            close: businessDayInputParser(unparsed.close)
          };
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

const  BusinessSaveButton = ({ handleSubmitWithRedirect, ...props  }) => {

  const form = useForm();
  const formState = useFormState();
  const handleClick = useCallback(() => {
    form.change('business_hours', normalizeBusinessHours(destringifyKeys(formState.values.business_hours)));
    handleSubmitWithRedirect('edit');
  }, [formState.values, formState.valid]);

  //
  // handleClick = () => {
  //   const { basePath, handleSubmit, redirect, isNew = true, previousData} = this.props;
  //   return handleSubmit(values => {
  //     this.props.save(values, basePath, redirect, isNew, previousData);
  //   })
  // };

  return (<SaveButton
      {...props}
      handleSubmitWithRedirect={handleClick}

  />)

}
BusinessSaveButton.propTypes = {

  handleSubmitWithRedirect: PropTypes.func,

};
export default BusinessSaveButton;
