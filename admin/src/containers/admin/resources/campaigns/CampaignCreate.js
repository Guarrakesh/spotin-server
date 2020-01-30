import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {
  BooleanInput,
  Create,
  FormWithRedirect,
  minLength,
  NumberInput,
  required,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar
} from 'react-admin';
import RewardRulesForm from "./RewardRulesForm";

const campaignTypes = [
  { id: 'referral', name: 'Referral Campaign'}
];
const rewardTypes = [
  { id: 'SPOT_COIN', name: 'Spot Coins'},
  { id: 'COUPON', name: 'Coupon' },

];


const CampaignCreateForm = (props) => {
  return (
      <FormWithRedirect
          {...props}
          render={formProps => (
              <form>
                <Box p="1em">
                  <Box display="flex">
                    <Box flex={2} mr="1em">
                      <Typography variant="h6" gutterBottom>General</Typography>

                      <Box display="flex" mb="2em">
                        <Box flex={1} mr="0.5em">
                          <TextInput  fullWidth source="name" label="Name" validate={required()}/>

                        </Box>
                        <Box flex={1} ml="0.5em">
                          <SelectInput fullWidth choices={campaignTypes} source="campaignType" validate={required()}/>
                        </Box>
                      </Box>


                    </Box>
                    <Box flex={1} ml="1em">
                      <BooleanInput fullWidth source="active"/>
                      <Typography variant="h6" gutterBottom>Reward options</Typography>
                      <Box flex={2}>
                        <SelectInput fullWidth choices={rewardTypes} source="rewardType" validate={required()}/>
                      </Box>
                      <Box display="flex">
                        <Box flex={1} mr="0.5em">
                          <NumberInput fullWidth source="rewardAssignmentDelay" />
                        </Box>
                        <Box flex={1} ml="0.5em">
                          <NumberInput fullWidth source="maximumRewardValue" label="Maximum Reward Value"/>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <RewardRulesForm source="rewardRules" validate={minLength(1)}/>



                </Box>
                <Toolbar>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <SaveButton
                        saving={formProps.saving}
                        handleSubmitSithRedirect={formProps.handleSubmitWithRedirect}
                    />
                    {/*<DeleteButton record={formProps.record} />*/}
                  </Box>
                </Toolbar>
              </form>


          )}
      />
  )
};


const CampaignCreate = (props) => {


  return (
      <Create {...props}>
        <CampaignCreateForm/>
      </Create>
  )

};




export default CampaignCreate;
