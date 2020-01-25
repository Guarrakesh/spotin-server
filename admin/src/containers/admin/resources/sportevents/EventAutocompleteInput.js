import React from "react";
import PropTypes from 'prop-types';
import {AutocompleteInput, ReferenceInput} from "react-admin";
import moment from "moment";
import "moment/locale/it";

moment.locale('IT');

export const eventSelectOptionRenderer = choice => {
  return choice && `${choice.name} @ ${moment(choice.start_at).calendar()}`
};
export const eventInputValueMatcher = (input, suggestion, getOptionText) =>
  getOptionText(suggestion)

    .toLowerCase()
    .trim()
  === (input.toLowerCase().trim())
  ;

const EventAutocompleteInput = ({record}) => (
  <ReferenceInput reference="events" source="event"
                  record={record}
                  filter={{next_events: 1}}
                  sort={{field: "start_at", order: "ASC"}}>
    <AutocompleteInput source="name"

                       optionText={eventSelectOptionRenderer}
                       // inputValueMatcher={eventInputValueMatcher}
                       translateChoice={false}
    />
  </ReferenceInput>
);

EventAutocompleteInput.propTypes = {
  record: PropTypes.object
};

export default EventAutocompleteInput;
