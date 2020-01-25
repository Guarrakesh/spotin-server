import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';
import {useFormState} from 'react-final-form';
import {useSelector} from "react-redux";
import ElementTypeField from './fields/ElementTypeField';

const FieldFormGenerator = (props) => {


    const formState = useFormState();
    const allElementTypes = useSelector(state => state.admin.resources['layout-elements'].data);

    const elementTypeId = formState.values.elementTypeId;
    const elementType = elementTypeId && allElementTypes ? allElementTypes[elementTypeId] : null;

    if (!elementType) return null;
    return (
        <Box p="1em">
          {elementType.fields.map(field => (
              <Box mr="1em" key={field.name}>

                <ElementTypeField field={field} source={`${props.source}.${field.name}`}/>

              </Box>
          ))}
        </Box>
    )

}

FieldFormGenerator.propTypes = {
  elementTypeId: PropTypes.string,
  elementType: PropTypes.object,
  source: PropTypes.string,
};




export default FieldFormGenerator;
