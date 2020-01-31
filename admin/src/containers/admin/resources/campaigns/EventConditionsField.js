/* eslint-disable */

import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from '@material-ui/core/Chip';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from '@material-ui/core/MenuItem';

import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import React, {useState} from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import {useFormState, useForm} from "react-final-form";
import get from 'lodash/get';
const ConditionOperator = {
  CONTAINS: 'CONTAINS',
  EQUAL: 'EQUAL',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  GREATHER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  RANGE: 'RANGE',
  PRESENT: 'PRESENT',
};

const EventConditionsTable = ({ conditions}) => {

  if (!conditions) return null;
  return (
      <TableContainer>
        <Table>
          <TableBody>
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
              {conditions.map(condition => (
                  <TableRow key={condition.id}>
                    <TableCell>{condition.parameterName}</TableCell>
                    <TableCell><Chip label={condition.operator} color="primary"/></TableCell>
                    <TableCell>{condition.value}</TableCell>
                  </TableRow>
              ))}
            </ReactCSSTransitionGroup>
          </TableBody>

        </Table>
      </TableContainer>

  )
};

EventConditionsTable.propTypes = {
  source: PropTypes.string,
};
const EventConditionsField = (props) => {

  const { systemEvent, ...rest } = props;

  const [newEventConditionDialogOpen, setNewEventConditionDialogOpen] = useState(false);

//   const form = useForm();

  const form = useForm();
  const formState = useFormState();
  const [internalFormState, setInternalFormState] = useState({});

  const handleAddNew = () => {
    const currentConditions = get(formState.values,`${props.source}.eventConditions`) || [];
    const newConditions = [...currentConditions, internalFormState];

    form.change(`${props.source}.eventConditions`, newConditions);
    setNewEventConditionDialogOpen(false);
  };

  const getOperatorOptions = () => {
    const eventParameter = systemEvent.parameters.find(p => p.name === internalFormState.parameterName);
    if (!eventParameter) return [];

    if (eventParameter.type === 'ARRAY') {
      return [ ConditionOperator.CONTAINS ];
    } else if (eventParameter.type === 'NUMBER' || eventParameter.type === 'TIMESTAMP') {
      return [ ConditionOperator.RANGE,
        ConditionOperator.EQUAL,
        ConditionOperator.GREATHER_THAN,
        ConditionOperator.LESS_THAN,
        ConditionOperator.RANGE,
        ConditionOperator.IN,
        ConditionOperator.NOT_IN,
      ]
    } else if (eventParameter.type === 'BOOLEAN') {
      return [ ConditionOperator.EQUAL ]
    } else if (eventParameter.type === 'STRING') {
      return [
        ConditionOperator.EQUAL,
        ConditionOperator.CONTAINS,
        ConditionOperator.IN,
        ConditionOperator.NOT_IN,
      ]
    } else {
      return Object.values(ConditionOperator);
    }
  };
  const getHelperText = () => {
    const eventParameter = internalFormState.operator;
    if (!eventParameter) return;
    switch (eventParameter.operator) {
      case ConditionOperator.NOT_IN:
      case ConditionOperator.IN:
      case ConditionOperator.RANGE:
        return 'Separate values with a semicolon ; ';


    }
    return '';
  };


  return (
      <Box flex={1} ml="1em">

        <Typography variant="h6" gutterBottom>Event conditions</Typography>
        <Typography variant="caption"> {systemEvent && systemEvent.name}</Typography>

        <EventConditionsTable conditions={get(formState.values, `${props.source}.eventConditions`)}/>

        <Button color="secondary" onClick={() => setNewEventConditionDialogOpen(true)}>Aggiungi condizione </Button>
        <Dialog open={newEventConditionDialogOpen}
                onBackdropClick={() => setNewEventConditionDialogOpen(false)}
                onExit={() => setNewEventConditionDialogOpen(false)} >
          <DialogTitle id={`${props.source}_new-event-condition-dialog`}>
            Add new event condition
          </DialogTitle>
          <DialogContent>

            <TextField
                label="Parameter Name"
                id="newEventParameterConditionName"
                select
                fullWidth
                value={internalFormState.parameterName}
                onChange={(e) => setInternalFormState({...internalFormState, parameterName: e.target.value})}
            >
              {systemEvent.parameters.map(param => <MenuItem key={param.id} value={param.name}>{param.name}</MenuItem> )}
            </TextField>

            <TextField
                style={{ marginTop: '0.5em'}}
                id="newEventParameterConditionOperator"
                fullWidth
                select
                label="Operator"
                onChange={(e) => setInternalFormState({...internalFormState, operator: e.target.value})}>
              {Object.values(getOperatorOptions()).map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
            </TextField>
            {internalFormState.operator !== 'PRESENT' &&
            <TextField
                style={{marginTop: '0.5em'}}
                label="Value"
                id="newEventParameterConditionValue"
                fullWidth
                onChange={(e) => setInternalFormState({...internalFormState, value: e.target.value})}
                helperText={getHelperText()}>
              {Object.values(ConditionOperator).map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
            </TextField>
            }


            <Button
                disabled={internalFormState.operator === 'PRESENT'
                    ? (!internalFormState.operator || !internalFormState.parameterName)
                    : (!internalFormState.operator || !internalFormState.parameterName || !internalFormState.value) }
                style={{ marginTop: '0.5em'}} fullWidth onClick={handleAddNew}>Confirm</Button>
          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>

      </Box>
  );
};

EventConditionsField.propTypes = {
  systemEvent: PropTypes.object,
};
export default EventConditionsField;


