import React from "react";
import {Datagrid, DateField, List, ReferenceField, ShowButton, TextField} from "react-admin";

const OfferedAnswersCountField = ({record}) => (
    <span>{record.offerdAnswers.length}</span>
)
export const BroadcastReviewQuestionList = (props) => (
    <List {...props}
          actions={<ListActions/>}
    >
      <Datagrid>
        <TextField source="text" label="Testo"/>
        <TextField source="multiplier" label="Fattore"/>
        <NumberField source="order" label="Ordine"/>
        <OfferedAnswersCountField label="Numero risposte"/>
      </Datagrid>
    </List>
);
