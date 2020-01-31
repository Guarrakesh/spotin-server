import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import {
  ArrayInput,
  FormDataConsumer,
  minValue,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
    minLength,
  SimpleFormIterator
} from 'react-admin';
import {useForm, useFormState} from "react-final-form";
import {useSelector} from "react-redux";
import EventConditionsField from "./EventConditionsField";


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
  const form = useForm();
  const selectedEventId = get(formState.values, `${props.source}.eventName`);

  const systemEvent = useSelector(state => state.admin.resources.systemevents.data[selectedEventId]);


  const handleFrequencyChange = () => {
    const frequency = get(formState.values, `${props.source}.frequency`);

    if (frequency === "ONCE") {
      form.change( `${props.source}.numOfTimes`, undefined )
    }
  };


  return (
      <Box p="0.5em">
        <Box display="flex">
          <Box flex={2} mr="1em">
            <Box mt="1em">
              <SelectInput variant="standard" validate={required()}  label="Who is the recipient?" fullWidth choices={recipientTypes} source={`${props.source}.recipientType`}/>
            </Box>
            <Box>
              <ReferenceInput fullWidth variant="standard" validate={required()}  label="Which event must be listen to?" reference="systemevents" source={`${props.source}.eventName`}>
                <SelectInput optionValue="id" optionText="name"/>
              </ReferenceInput>
            </Box>

            <Box mt="1em">
              <NumberInput label="Reward value" validate={required()} source={`${props.source}.rewardValue`} fullWidth />
            </Box>
            <Box display="flex" mt="1em">
              <Box flex="3" mr="0.5em">
                <SelectInput label="Frequency" fullWidth
                             onChange={handleFrequencyChange}
                             helperText="How much times event must be triggered?"
                             choices={RuleFrequencies} source={`${props.source}.frequency`}/>
              </Box>
              <FormDataConsumer >
                {({formData}) => (
                    get(formData,`${props.source}.frequency`) === 'N_TIMES'
                        ? (
                            <Box flex={1} ml="0.5em" >
                              <NumberInput
                                  validate={minValue(2)}
                                  fullWidth label="Num of times" source={`${props.source}.numOfTimes`}/>
                            </Box>
                        )   : null

                )}
              </FormDataConsumer>
            </Box>

          </Box>
          {systemEvent && systemEvent.parameters.length > 0 &&
          <EventConditionsField systemEvent={systemEvent} {...props}/>
          }
        </Box>
      </Box>
  )
};
RewardRuleField.propTypes = {
  source: PropTypes.string,
};

const RewardRulesForm = (props) => {


  return (

      <Box component="fieldset" mt="1em">
        <Typography variant="h6">Reward Rules</Typography>
        <Box>
          <ArrayInput {...props} validate={[required(), minLength(1)]}>
            <SimpleFormIterator>
              <RewardRuleField />
            </SimpleFormIterator>
          </ArrayInput>
        </Box>
      </Box>
  )

};






export default RewardRulesForm;
