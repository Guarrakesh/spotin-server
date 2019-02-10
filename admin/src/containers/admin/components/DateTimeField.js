import get from "lodash/get";
import moment from "moment";
import React from "react";
import PropTypes from 'prop-types';

const DateTimeField = ({record, source, format}) => {
  const sourceValue = get(record, source);

  const dateTime = moment(sourceValue).locale('IT').format(format || 'dddd, D MMM YYYY').toUpperCase();
  return (<span>{dateTime}</span>)
};

DateTimeField.propTypes = {
  record: PropTypes.object,
  source: PropTypes.string,
  format: PropTypes.string,
}
export default DateTimeField;