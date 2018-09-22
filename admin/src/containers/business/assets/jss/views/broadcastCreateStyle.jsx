/* eslint-disable */
import {
  successColor,
  primaryColor,
  tooltip,
  boxShadow,
  dangerColor,
  cardTitle,
  grayColor} from "business/assets/jss/material-dashboard-pro-react";
import customSelectStyle from "business/assets/jss/material-dashboard-pro-react/customSelectStyle";
import customCheckboxRadioSwitch from "business/assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";
import modalStyle from "business/assets/jss/material-dashboard-pro-react/modalStyle.jsx";
const eventPageStyle = theme => ({
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
  },


  /* Offer Form */
  plusOfferSwitch: {
    margin: '32px 0 0 ',
    width: '100%'
  },

  plusOfferContainer: {
    padding: '8px 16px',
    border: '2px solid ' + primaryColor,
    borderRadius: '8px'

  },
  plusOfferDisabled: {
    "&:before": {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0, left: 0,
      backgroundColor: primaryColor,
      opacity: '.5',
    }
  },
  offerValueSlider: {
    margin: '32px 0 32px',
    width: '100%'

  },
  spotBoxContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    "& span": {
      fontSize: '21px',
      fontWeight: 500,
    }
  },
  subTotalSpot: {
    fontSize: '24px',
    fontWeight: 500,
    color: primaryColor,
    "& svg": {
      marginLeft: '8px'
    }
  },
  additionalSpots: {
    fontSize: '21px',
    fontWeight: 500,
    color: grayColor,
    textAlign: 'center'
  },
  totalSpots: {
    fontSize: '32px',
    color: primaryColor,
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    textAlign: 'center'
  },
  toolbar: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down("md")]: {
      justifyContent: 'center'
    },
  },
  form: {
    justifyContent: 'center',
    [theme.breakpoints.down("md")]: {
      flexDirection: 'column'
    },
  },
  offerTitleFormControl: {
    display: 'block'
  },
  center: {
    textAlign: "center"
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  marginRight: {
    marginRight: "5px"
  },
  modalSectionTitle: {
    marginTop: "30px"
  },
  submitFooter: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    justifyContent: 'center'
  },
  ...modalStyle(theme)
});




export default eventPageStyle;
