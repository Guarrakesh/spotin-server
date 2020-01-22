import PropTypes from 'prop-types';
import React from 'react';
import {REDUX_FORM_NAME} from 'react-admin';
import {connect} from 'react-redux';
import {formValueSelector,} from 'redux-form';
import ElementTypeField from './fields/ElementTypeField';

class FieldFormGenerator extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.elementTypeId !== this.props.elementTypeId;
  }

  render() {

    if (!this.props.elementType) {
      return null;
    }
    return (
        <div style={{margin: '1em'}}>
          {this.props.elementType.fields.map(field => (
              <div key={field.name}>
              <ElementTypeField field={field} source={`${this.props.source}.${field.name}`}/>
              </div>
          ))}
        </div>
    )
  }

}

FieldFormGenerator.propTypes = {
  elementTypeId: PropTypes.string,
  elementType: PropTypes.object,
  source: PropTypes.string,
}

const selector = formValueSelector(REDUX_FORM_NAME);

const mapStateToProps = state => {
  const elementTypeId =  selector(state, 'elementTypeId');
  const allElementTypes =  state.admin.resources['layout-elements'].data;
  return {
    elementTypeId,
    elementType: elementTypeId && allElementTypes ? allElementTypes[elementTypeId] : null,
  };

};

export default connect(
  mapStateToProps
)(FieldFormGenerator);
