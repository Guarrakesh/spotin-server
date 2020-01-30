import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from 'prop-types';
import { useSelector }  from "react-redux";
import React from 'react';
import {
  ArrayInput,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TextInput
} from 'react-admin';
import {useFormState} from "react-final-form";
import get from 'lodash/get';

const recipientTypes = [
  { id: 'USER', name: 'User' },
  { id: 'REFERRER', name: 'Referrer' },
];

const RuleFrequencies = [
  { id: 'ONCE', name: 'Once'},
  { id: 'N_TIMES', name: 'N_TIMES'},
];
const RewardRuleField = (props) => {


  const formState = useFormState();
  const selectedEventId = get(formState.values, `${props.source}.eventName`);

  const systemEvent = useSelector(state => state.admin.resources.systemevents.data[selectedEventId]);


  return (
      <Box p="1em">
        <Box display="flex">
          <Box flex={2}>
            <Box mt="1em">
              <SelectInput variant="standard" label="Who is the recipient?" fullWidth choices={recipientTypes} source={`${props.source}.recipientType`}/>
            </Box>
            <Box>
              <ReferenceInput fullWidth variant="standard" label="Which event must be listen to?" reference="systemevents" source={`${props.source}.eventName`}>
                <SelectInput optionValue="id" optionText="name"/>
              </ReferenceInput>
            </Box>

            <NumberInput source={`${props.source}.rewardValue`} />
            <SelectInput choices={RuleFrequencies} source={`${props.source}.frequency`}/>
            <FormDataConsumer >
              {({formData}) => (
                  formData[`${props.source}.frequency`] === 'N_TIMES'
                      ? <NumberInput  {...props} source={`${props.source}.numOfTimes`}/>
                      : null
              )
              }
            </FormDataConsumer>

            <TextInput source={`${props.source}.rewardAssignmentMessage`}/>
          </Box>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>Event conditions</Typography>
            {systemEvent && systemEvent.name}
          </Box>
        </Box>
      </Box>
  )
};
RewardRuleField.propTypes = {
  source: PropTypes.string.isRequired,
};

const RewardRulesForm = (props) => {


  return (

      <FormControl component="fieldset">
        <FormLabel component="legend">Reward Rules</FormLabel>

        <FormGroup>
          <ArrayInput {...props}>
            <SimpleFormIterator style={{ marginTop: "1.2rem"}}>
              <RewardRuleField/>
            </SimpleFormIterator>
          </ArrayInput>
        </FormGroup>
      </FormControl>
)

};






export default RewardRulesForm;
