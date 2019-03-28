/* eslint-disable */
import {connect} from "react-redux";
import {showNotification, UPDATE} from "ra-core";
import { withStyles, createStyles } from "@material-ui/core";

import dataProvider from "../../../../providers/dataProvider";
import {Button} from "@material-ui/core";
import { fade } from '@material-ui/core/styles/colorManipulator';
import { red } from '@material-ui/core/colors';
import React from "react";
import { push } from 'react-router-redux'; // eslint-disable-line

const RejectReviewButton = connect(undefined, { showNotification, push })
(({ push, record, showNotification, classes }) => {

  const handleClick = () => {

    const path = `reservations/${record._id}/reviews`;

    dataProvider(UPDATE, path, { id: record.review._id, data: { status: -1 } })
        .then(() => {
          showNotification('Recensione rifiutata');
          push('/reservations');
        })
        .catch(e => {
          console.error(e);
          showNotification('Errore: ' + e);
        })
  };
  return record && record.review ? (
      <Button
            disabled={!([0,1].includes(record.review.status))}
    className={classes.deleteButton}
              onClick={handleClick}>
        {"Rifiuta"}
      </Button>
  ) : null;

});

const styles = theme =>
    createStyles({
      deleteButton: {
        backgroundColor: red['400'],
        color: 'white',
        fontWeight: 300,
        '&:hover': {
          backgroundColor: fade(red['400'], 0.12),
          // Reset on mouse devices
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
    });
export default withStyles(styles)(RejectReviewButton);
