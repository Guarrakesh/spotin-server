/* eslint-disable */
import {connect} from "react-redux";
import {showNotification, UPDATE} from "ra-core";
import dataProvider from "../../../../providers/dataProvider";
import {Button, withStyles, createStyles } from "@material-ui/core";
import React from "react";
import { push } from 'react-router-redux'; // eslint-disable-line
import { fade } from '@material-ui/core/styles/colorManipulator';
import { green } from '@material-ui/core/colors';
const ApproveReviewButton = ({ push, record, showNotification, classes, ...props }) => {

  const handleClick = () => {

    const path = `reservations/${record._id}/reviews`;
    dataProvider(UPDATE, path, { id: record.review._id, data: { status: 1} })
        .then(() => {
          showNotification('Recensione approvata!');
          push('/reservations');
        })
        .catch(e => {
          console.error(e);
          showNotification('Errore: ' + e);
        })
  };
  return record && record.review ? (
      <Button disabled={!([0,-1].includes(record.review.status))}

              className={classes.deleteButton} onClick={handleClick}
              {...props}>
        {"Approva"}</Button>
  ) : null;

};

const styles = theme =>
    createStyles({
      deleteButton: {
        backgroundColor: green['A400'],
        color: 'white',
        fontWeight: 300,
        '&:hover': {
          backgroundColor: fade(green['A400'], 0.7),
          // Reset on mouse devices
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
    });
export default connect(undefined, { showNotification, push})(
    withStyles(styles)(ApproveReviewButton));
