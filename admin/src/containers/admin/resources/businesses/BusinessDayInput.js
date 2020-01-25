import MomentUtils from "@date-io/moment";
import {Button, Checkbox, FormControlLabel, Grid} from '@material-ui/core'
import {get} from 'lodash';
import moment from 'moment';
/* eslint-disable */
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import {TimeInput} from 'react-admin-date-inputs'
import {useFormState, useForm} from 'react-final-form'; // eslint-disable-line
import {FieldArray} from "react-final-form-arrays";

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì" ,"Sabato" , "Domenica"];

const normalizeMinutes = minutes => {
  // Normalizza il valore nel range [0,1440].
  let parsed = minutes;
  if (minutes < 0) {
    parsed = 1440 - Math.abs(parsed);
  } else if (minutes > 1440) {
    parsed = minutes - 1440;
  }
  return parsed;
};

const businessDayInputFormatter = (value => {


  if (typeof value === "number") {

    const date = new Date();
    const n = Math.abs(normalizeMinutes(value - date.getTimezoneOffset()) / 60);
    const h = Math.floor(n);
    const m = Math.floor((n - h)*60);
    const hours = h.toString().length == 2 ? h.toString() : `0${h}`;

    const minutes = m.toString().length == 2 ? m.toString() : `0${m}`;

    return moment(`${hours}:${minutes}`, 'hh:mm');
  }


  return value;

});

const renderOpening = (name, index, fields) => (
    <React.Fragment>
      <Grid item xs={5}>
        <TimeInput
            options={{ ampm: false,  format: 'HH:mm'  }}
            providerOptions={{ utils: MomentUtils, }}
            format={businessDayInputFormatter}
            name={`${name}.open`} label="Apertura"/>
      </Grid>
      <Grid item xs={5}>
        <TimeInput
            providerOptions={{ utils: MomentUtils }}
            options={{ ampm: false, format: 'HH:mm' }}
            format={businessDayInputFormatter}
            name={`${name}.close`}  label="Chiusura"/>
      </Grid>
      <Grid item xs={2}>
        <Button
            type="button"
            title="Rimuovi"
            onClick={() => fields.remove(index)}>Rimuovi</Button>
      </Grid>

    </React.Fragment>
);

// return (<section>
//   <InputLabel {...props}>{dayNames[day]}</InputLabel>
//   <BooleanInput label="Aperto" source={`${input.name}.open`}/>
//   <FormDataConsumer>
//     {({formData}) =>
//         (formData.business_hours && formData.business_hours[day] && formData.business_hours[day].open) &&
//         <ArrayInput label={`Aperture del ${dayNames[day]}`}
//                     source={`${input.name}.openings`}>
//           <SimpleFormIterator>
//             <TextInput label="Apertura" source={`open`}/>
//             <TextInput label="Chiusura" source={`close`}/>
//           </SimpleFormIterator>
//         </ArrayInput>
//     }
//
//   </FormDataConsumer>
// </section>);




const BusinessDayInput = ({ fields}) => {


  return (
      <Grid container spacing={16}>

        {fields.map((name, index) => renderOpening(name, index, fields))}
        <Grid item xs={12}>
          <Button mini  size="small" onClick={() => fields.push({ open: 0, close: 0})}>Aggiungi apertura/chisura</Button>
        </Grid>
      </Grid>
  )

}


BusinessDayInput.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  touched: PropTypes.booleanm,
  error: PropTypes.string,

  day: PropTypes.number,
  source: PropTypes.string,
};

const BusinessDayInputField = (props) => {


  const source = `${props.source}.${props.day}.openings`;
  const stringifiedSource = `${props.source}.key${props.day}.openings`;

  const state = useFormState();
  const initialValue = get(state.values, source);
  const [open, setOpen] = useState(initialValue.length > 0);

  return (
      <React.Fragment>
        <FormControlLabel

            control={<Checkbox
                label={dayNames[props.day]}
                checked={open}
                onChange={(e, v) => setOpen(!open)}

            />}
            label={`${dayNames[props.day]} aperto`}
        />
        {open ? <FieldArray
            initialValue={initialValue}
            component={BusinessDayInput}
            name={stringifiedSource}/> : null}
      </React.Fragment>
  )


}


export default BusinessDayInputField;
