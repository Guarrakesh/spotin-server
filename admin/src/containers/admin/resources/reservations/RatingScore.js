import React from 'react';
import { withStyles } from "@material-ui/core";
/* eslint-disable */
const RatingScore
    = ({
         ratingKey,
         label,
         classes,
    record,
         color = '#ddd'
       }) => (
    <div className={classes.container}>
      <div className={classes.circle}
           style={{borderColor: color}}>
        <span className={classes.value}
              style={{color}}>{record.review[ratingKey]}</span>
      </div>
      <span className={classes.label}
            color={{color}}
      >{label || ratingKey}</span>
    </div>
);


const styles = () => ({
  circle: {
    padding: '32px',
    borderRadius: '100%',
    width: 100,
    height: 100,
    border: '2px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    letterSpacing: 0.5,
    fontSize: 12,
  },
  container: {
    margin: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontWeight: '700',
    fontSize: 21,
    letterSpacing: 1.5,
  }
});
export default withStyles(styles)(RatingScore);
