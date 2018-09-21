import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable */
import Hidden from '@material-ui/core/Hidden';
import classnames from 'classnames';
import VersionedImageField from "./VersionedImageField";


//TODO: Generalizzare il campo per altri view (per ora è adattato alla pagina di visualizzazione e creazione broadcast
const CompetitorField = ({
  record,
  classes,
  className
}) => (
  <div className={classnames(className, classes.eventCompetitor)}>
    <span className={classes.eventCompetitorName}> {record.name} </span>
    <Hidden mdDown>
      <div className={classes.eventCompetitorLogo}>
        <VersionedImageField record={record} source="image_versions" minSize={{width: 64, height: 64}}/>
      </div>
    </Hidden>
  </div>
);

CompetitorField.propTypes = {
  record: PropTypes.object,
  classes: PropTypes.object,
  className: PropTypes.string
}
export default CompetitorField;
