import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';


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

export const StyledImageField = ({
  className,
  classes = {},
  record,
  source,
  src,
  title,
  imgClassName,
  ...rest
}) => {
  const sourceValue = get(record, source);
  if (!sourceValue) {
    return <div className={className} {...sanitizeRestProps(rest)} />;
  }

  if (Array.isArray(sourceValue)) {
    return (
      <ul
        className={classnames(classes.list, className)}
        {...sanitizeRestProps(rest)}
      >
        {sourceValue.map((file, index) => {
          const titleValue = get(file, title) || title;
          const srcValue = get(file, src) || title;

          return (
            <li key={index}>
              <img
                alt={titleValue}
                title={titleValue}
                src={srcValue}
                className={classnames(classes.image, imgClassName)}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  const titleValue = get(record, title) || title;

  return (
    <div className={className} {...sanitizeRestProps(rest)}>
      <img
        title={titleValue}
        alt={titleValue}
        src={sourceValue}
        className={classes.image}
      />
    </div>
  );
};

StyledImageField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  classes: PropTypes.object,
  record: PropTypes.object,
  sortBy: PropTypes.string,
  source: PropTypes.string.isRequired,
  src: PropTypes.string,
  title: PropTypes.string,
  imgClassName: PropTypes.string
};

export default withStyles(styles)(StyledImageField);
