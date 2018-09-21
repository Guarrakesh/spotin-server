/* eslint-disable */
import {
  successColor,
  tooltip,
  boxShadow,
  dangerColor,
  cardTitle } from "business/assets/jss/material-dashboard-pro-react";
import customSelectStyle from "business/assets/jss/material-dashboard-pro-react/customSelectStyle";
import customCheckboxRadioSwitch from "business/assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";

const eventPageStyle = {
  ...customCheckboxRadioSwitch,
  ...customSelectStyle,
  cardTitle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: "rgba(0, 0, 0, 0.26)",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex"
  },

  eventCardHeader: {
    position: 'relative',
    paddingBottom: '32px',
    borderBottom: '1px solid #eee'
  },
  eventCardIcon: {


    width: '96px',
    height: '96px',
    top: '-24px',
    margin: '-48px auto 0 auto',
    backgroundColor: 'white',
    ...boxShadow,
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    "& img": {
      width: '48px',
      height: 'auto',
    }
  },

  eventCardBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flexBasis: '200px'

  },
  eventDateTime: {
    marginTop: '32px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'

  },
  eventDate: {
    fontSize: '24px',
    fontWeight: 500,
    marginBottom: '16px'
  },
  eventTime: {
    fontSize: '32px',
    fontWeight: 300,
  }

}




export default eventPageStyle;
