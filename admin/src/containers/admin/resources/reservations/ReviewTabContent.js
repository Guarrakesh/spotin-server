import React from 'react';
import { withStyles } from "@material-ui/core";

import RatingScore from './RatingScore';
import ApproveButton from './ApproveReviewButton';
import RejectButton from './RejectReviewButton';
/* eslint-disable */
import ratingLabels from './ratingLabels';
const ReviewTabContent
    = ({
         record,
         classes,
         ...props,
       }) => (

    <div>
      {record.review ? (
              <React.Fragment>
                <div className={classes.ratings} >
                  <RatingScore ratingLabels={ratingLabels.av}
                               record={record} ratingKey="av" colorize label="Audio/Video"/>
                  <RatingScore ratingLabels={ratingLabels.food}
                               record={record} ratingKey="food" colorize label="Cibo"/>
                  <RatingScore ratingLabels={ratingLabels.price}
                               record={record} ratingKey="price" label="Prezzo"/>
                  <RatingScore ratingLabels={ratingLabels.people}
                               record={record} ratingKey="people" label="Persone/Ambiente"/>
                  <RatingScore ratingLabels={ratingLabels.sub}
                               record={record} ratingKey="sub" label="Parere personale"/>
                </div>
                <div className={classes.commentContainer}>
                  {record.review.comment ?
                      <span className={classes.comment}>" {record.review.comment} " </span>
                      : "Nessun commento" }
                </div>
                <div className={classes.actions}>
                  <RejectButton record={record} {...props} />
                  <ApproveButton record={record} {...props} style={{marginLeft: 16}} />
                </div>
              </React.Fragment>
          )
          : <p>Non è stata effettuata alcuna recensione</p>
      }
    </div>

)

const styles = theme => ({
  ratings: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
  commentContainer: {
    marginTop: 32,
    textAlign: 'center',
    '&:before': {
      content: "'lala'",
      position: "absolute",
      left: 0,
      top: 0,
    }
  },
  comment: {
    fontStyle: 'italic',
    fontSize: 32,
  },

  actions: {
    marginTop: 63,
    display: 'flex',
    justifyContent: 'flex-end',
  }

});
export default withStyles(styles)(ReviewTabContent);
