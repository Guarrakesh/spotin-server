import React from 'react';
import RatingScore from './RatingScore';
/* eslint-disable */

const ReviewTabContent
    = ({
         record,
       }) => (
    <div>
      {record.review ? (
          <React.Fragment>
            <RatingScore record={record} ratingKey="av" label="Audio/Video"/>
            <RatingScore record={record} ratingKey="food" label="Cibo"/>
            <RatingScore record={record} ratingKey="price" label="Prezzo"/>
            <RatingScore record={record} ratingKey="people" label="Persone/Ambiente"/>
            <RatingScore record={record} ratingKey="sub" label="Parere personale"/>
          </React.Fragment>
          )
          : <p>Non è stata effettuata alcuna recensione</p>
      }
    </div>
)

export default ReviewTabContent;
