import React from 'react';
import { withStyles } from "@material-ui/core";
import { red, green, orange, blue } from '@material-ui/core/colors';

/* eslint-disable */

const RatingScore
    = ({
         ratingKey,
         label,
         classes,
         record,
         ratingLabels = {},
         color = null,
    colorize,
       }) => {

  const ratingColorMap = {
    1: red[400],
    2: orange[400],
    3: '#ddd',
    4: blue[400],
    5: green[400]
  };

  const rating = record.review.rating[ratingKey];
  if (colorize) {
    color = ratingColorMap[rating];
  }
  return (
      <div className={classes.container}>
        <div className={classes.label}
             color={{color}}
        >{label || ratingKey}</div>
        <div className={classes.circle}
             style={{borderColor: color}}>
        <span className={classes.value}
              style={{color}}>{rating || "N/A"}</span>
        </div>
        <div className={classes.label}
             color={{color}}
        >{ratingLabels[rating] || "N/A"}</div>
      </div>
  )
};



const styles = (theme) => ({
  circle: {
    padding: '32px',
    borderRadius: '100%',
    width: 32,
    height: 32,
    border: '4px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      padding: 8,
    }
  },
  label: {

    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0,
    fontSize: 12,
  },
  container: {
    margin: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  value: {
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 1.5,
  }
});
export default withStyles(styles)(RatingScore);
