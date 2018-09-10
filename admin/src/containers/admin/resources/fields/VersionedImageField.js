import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


const styles = {
  list: {
    display: 'flex',
    listStyleType: 'none',
  },
  image: {
    margin: '0.5rem',
    maxHeight: '10rem',
  },
};
/* eslint-disable */
const sanitizeRestProps = (rest) => ({
  addLabel,
  allowEmpty,
  basePath,
  cellClassName,
  className,
  formClassName,
  headerClassName,
  label,
  linkType,
  locale,
  record,
  resource,
  sortable,
  sortBy,
  source,
  textAlign,
  translateChoice,
  ...rest
}) => rest;
/* eslint-enable */


export const VersionedImageField = ({
  className,
  classes,
  record,
  source,
  minSize,
  title,
  ...rest
}) => {
  //Posto che il source dato in ingresso sia un'array, trovo la versione dell'immagine con la dimensione più prossima a quella data (minSize)

  const sourceValue = get(record, source);
  if (!sourceValue)
    return <div className={className} {...sanitizeRestProps(rest)} />;
  let version; //oggetto con { url, width, height }
  if (sourceValue.length == 1) {
    version = sourceValue[0];
  } else {
    //Ordino l'array di immagini in ordine crescente di dimensioni in base a minSize (uso la distanza euclidea)
    const sorted = version.sort((a,b) =>  {
      const aToMinSizeDistance = Math.sqrt(Math.pow((a.width - minSize.width),2) - Math.pow((a.height - minSize.height), 2));
      const bToMinSizeDistance = Math.sqrt(Math.pow((b.width - minSize.width),2) - Math.pow((b.height - minSize.height), 2));
      //Se la differenza è < 0, allora la distanza di A da minSize è minore e quindi a è più vicino a minSize di quanto lo sia b
      return aToMinSizeDistance - bToMinSizeDistance;
    });
    version = sorted[0];
  }

  const titleValue = get(record, title) || title;
  return (
    <div className={className} {...sanitizeRestProps(rest)}>
      <img
        title={titleValue}
        alt={titleValue}
        src={sourceValue}
        className={classnames(classes.image)}
      />
    </div>
  );


}

VersionedImageField.defaultProps = {
  minSize: {width: 32, height: 32 }
};

VersionedImageField.propTypes = {

  className: PropTypes.string,
  minSize: PropTypes.object,
  classes: PropTypes.object,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles)(VersionedImageField);


