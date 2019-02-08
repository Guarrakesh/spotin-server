import React, {useState} from 'react';
import {get} from 'lodash';
import moment from 'moment';
/* eslint-disable */
import PropTypes from 'prop-types';

import {TimePicker} from 'material-ui-pickers';
import {Button, Checkbox, FormControlLabel, Grid} from '@material-ui/core'
import {Field, FieldArray} from 'redux-form'; // eslint-disable-line

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì" ,"Sabato" , "Domenica"];

const businessDayInputParser = (value => {
  let hour, minute;

  if (value instanceof moment) {
    hour = parseInt(value.hour(), 10);
    minute = parseInt(value.minute(), 10);
  } else {
    hour = parseInt(value.split(":")[0], 10);
    minute = parseInt(value.split(":")[1], 10);
  }

  const parsed = hour * 60 + minute; //Restituisce i minuti
  return parsed;
});
const businessDayInputFormatter = (value => {

  if (typeof value === "number") {


    const n = Math.abs(value / 60); // Rendo positivo
    const h = Math.floor(n)
    const m = Math.floor((n - h)*60);
    const hours = h.toString().length == 2 ? h.toString() : `0${h}`;

    const minutes = m.toString().length == 2 ? m.toString() : `0${m}`;

    return moment(`${hours}:${minutes}`, 'hh:mm');
  }

  return value;

});
const renderTimeField = ({
                           input,
                           label,
                           meta: { touched, error },
                           ...custom
                         }) => {



  return (
      <TimePicker
          autoOk
          ampm={false}

          label={label}
          type="time"
          errorText={touched && error}
          {...input}
          {...custom}
          value={input.value}
          keyboard
          id="outlined-full-width"
          style={{margin: 8}}
          placeholder="12:00"
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
      />
  )
}

const renderOpening = (opening, index, fields) => (
    <React.Fragment>
      <Grid item xs={5}>
        <Field normalize={businessDayInputParser} format={businessDayInputFormatter}
               name={`${opening}.open`} component={renderTimeField} label="Apertura"/>
      </Grid>
      <Grid item xs={5}>
        <Field
            normalize={businessDayInputParser} format={businessDayInputFormatter}
            name={`${opening}.close`} component={renderTimeField} label="Chiusura"/>
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

        {fields.map(renderOpening)}
        <Grid item xs={12}>
          <Button mini  size="small" onClick={() => fields.push({})}>Aggiungi apertura/chisura</Button>
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


  const value = get(props.record, props.source);

  const [open, setOpen] = useState(value ? value.openings.length > 0 : false);

  return (
      <React.Fragment>
        <FormControlLabel

            control={<Checkbox
                label={dayNames[props.day]}
                checked={open}
                onChange={(e, v) => setOpen(v)}

            />}
            label={`${dayNames[props.day]} aperto`}
        />
        {open ? <FieldArray component={BusinessDayInput} name={`${props.source}.openings`}/> : null}
      </React.Fragment>
  )


}
export default BusinessDayInputField;