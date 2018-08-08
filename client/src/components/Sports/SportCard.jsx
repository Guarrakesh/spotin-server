import React from 'react';
import Helpers from 'helpers';

import {
  Breadcrumb,   Col,
  Image, Button
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import Images from 'variables/images.jsx';
const SportCard = (props) => {

    return (


          <Card
            title={props.name}
            textCenter
            ctTextCenter
            content={
              <Image src={Images.icons.sports[Helpers.sportSlugIconMap(props.slug)]} style={{width: 64}}/>
            }

            />



    );
};


export default SportCard;
