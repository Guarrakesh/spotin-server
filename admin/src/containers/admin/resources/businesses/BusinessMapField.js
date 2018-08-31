import React from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const BusinessMapField = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAjhLABUIehL464nlbYk3YobnCOGRi5sDI",
    loadingElement: <div style={{height: '100%'}} />,
    containerElement: <div style={{height: '400px'}}/>,
    mapElement: <div style={{height: '100%'}} />
  }),
  withScriptjs,
  withGoogleMap
)(({record, isMarkerShown, source}) => {
  const point = get(record, source);
  if (!point)
    return null;
  return <GoogleMap defaultZoom={14} defaultCenter={{lat: point[1], lng: point[0]}}>
    {isMarkerShown && <Marker position={{lat: point[1], lng: point[0]}}/>}
  </GoogleMap>
});

BusinessMapField.propTypes = {
  isMarkerShown: PropTypes.bool,
  point: PropTypes.object
};
export default BusinessMapField;
