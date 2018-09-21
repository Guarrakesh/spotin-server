import React from 'react';
import PropTypes from 'prop-types';

import { ReferenceField, crudGetManyAccumulate as crudGetManyAccumulateAction } from 'react-admin';
import {withStyles} from "@material-ui/core/styles";
import eventNameFieldStyle  from 'business/assets/jss/fields/eventNameFieldStyle';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';

import CompetitorField from './CompetitorField';


class EventField extends React.Component {

  componentDidMount() {

    this.fetchCompetitors();
  }
  componentWillReceiveProps(nextProps) {
    const { record } = this.props;
    if (record.id !== nextProps.record.id) {
      this.fetchCompetitors();

    }
  }
  fetchCompetitors() {
    const { record } = this.props;

    this.props.crudGetManyAccumulate('competitions', [record.competition]);

  }

  render() {
    const {record, basePath, classes, competition} = this.props;

    if (!competition) {
      return null;

    }

    if (competition.competitorsHaveLogo && record.competitors.length === 2) {
      return (

        <div className={classes.eventCompetitors}>
          <ReferenceField  basePath={basePath}  reference="competitors" source="competitors[0].competitor" record={record} linkType={false}>
            <CompetitorField className={classes.eventCompetitor1} classes={classes}/>
          </ReferenceField>
          <span className={classes.competitorSeparator}>—</span>
          <ReferenceField  linkType={false}  basePath={basePath} reference="competitors" source="competitors[1].competitor" record={record}>
            <CompetitorField className={classes.eventCompetitor2} classes={classes}/>
          </ReferenceField>
        </div>
      )
    } else {
      return (
        <div className={classes.eventName}>
          {record.name}
        </div>
      )
    }

  }
}

ReferenceField.defaultProps = {
  referenceRecord: null,
  record: {}
};

const mapStateToProps = (state, props) => ({
  competition: state.admin.resources["competitions"].data[
      get(props.record, "competition")
    ]
});


EventField.propTypes = {

  record: PropTypes.object,
  basePath: PropTypes.string,
  classes: PropTypes.object,
  competition: PropTypes.object,
  crudGetManyAccumulate: PropTypes.func,

};


export default compose(
  connect(mapStateToProps,
    {
      crudGetManyAccumulate: crudGetManyAccumulateAction
    }),
  withStyles(eventNameFieldStyle)
)(EventField);

