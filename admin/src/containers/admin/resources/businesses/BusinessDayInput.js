import React, { useState } from 'react';
import { debounce } from 'lodash';
/* eslint-disable */
import PropTypes from 'prop-types';

import { InputLabel, Checkbox, FormControlLabel, Button, Divider, TextField, List, ListItem, Grid } from '@material-ui/core'
import { Field, FieldArray } from 'redux-form'; // eslint-disable-line

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì" ,"Sabato" , "Domenica"];
const businessDayInputParser = value => {
  if (value && value.indexOf && value.indexOf(":") !== -1 && value.length === 5) {
    console.log("TO PARSE", value);
    const splitted = value.split(":");
    const parsed = parseInt(splitted[0],10) * 60 + parseInt(splitted[1],10); //Restituisce i minuti
    console.log("parsed", parsed);
    return parsed;
  }
  return value;
};
const businessDayInputFormatter = value => {

  if (value && typeof value === "number") {

    const n = Math.abs(value / 60); // Rendo positivo
    const h = Math.floor(n)
    const m = Math.floor((n - h)*60);
    const hours = h.toString().length == 2 ? h.toString() : `0${h}`;

    const minutes = m.toString().length == 2 ? m.toString() : `0${m}`;
    console.log("formatted",`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  }
  return value;
};
const renderTimeField = ({
                           input,
                           label,
                           meta: { touched, error },
                           ...custom
                         }) => (

    <TextField

        label={label}
        type="time"
        errorText={touched && error}
        {...input}
        {...custom}
        id="outlined-full-width"
        style={{ margin: 8 }}
        placeholder="12:00"
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
    />


)
// eslint-disable

const renderCheckbox = ({ input, label }) => (
    <FormControlLabel

        control={<Checkbox
            name={input.name}
            label={label}
            checked={input.value ? true : false}
            onChange={input.onChange}
        />}
        label={label}
    />
)


const renderOpening = (opening, index, fields) => (
    <React.Fragment>
      <Grid item xs={5}>
        <Field parse={debounce(businessDayInputParser, 200)} format={debounce(businessDayInputFormatter,200)}
               name={`${opening}.open`} component={renderTimeField} label="Apertura"/>
      </Grid>
      <Grid item xs={5}>
        <Field
            parse={debounce(businessDayInputParser, 200)} format={debounce(businessDayInputFormatter,200)}
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




const BusinessDayInput = ({ fields, source, day}) => {

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

    
  const [open, setOpen] = useState(0);
  return (
      <div>
        <Field
            onChange={(e, v) => setOpen(v)}
            name={`${props.source}`} component={renderCheckbox} label={dayNames[props.day]}/>

        {open ? <FieldArray component={BusinessDayInput} name={`${props.source}.openings`}/> : null}
      </div>
  )


}
export default BusinessDayInputField;