import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import { TabbedForm, required, TextInput, DateInput, ImageField, ImageInput, NumberInput, Create, FormTab } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

const styles = () => ({
  inlineBlock: { display: 'inline-flex', marginRight: '1em'}
});

const RestaurantRelatedRules = (props) => (
    <fieldset>
      <legend>Restaurant related rules</legend>
      <NumberInput source="restaurantRelatedRules.minimumSpending" label="Spesa minima (in EUR)" {...props}/>
      <NumberInput source="restaurantRelatedRules.maximumValue" label="Valore massimo (in EUR)" {...props}/>
    </fieldset>
);
const PrizeCreate = withStyles(styles)(({classes, ...props}) => {
  return (
      <Create { ...props}>
        <TabbedForm>
          <FormTab label="General">
            <ImageInput validation={{ required: true }} source="imageFile" accept="image/*">
              <ImageField source="src"/>
            </ImageInput>
            <TextInput
                validate={[required()]}
                formClassName={classes.inlineBlock} source="name"/>
            <NumberInput
                validate={[required()]}
                source="cost"
                label="Costo (in SpotCoin)"
            />
            <NumberInput
                formClassName={classes.inlineBlock} source="availability" label="Disponibilità"/>
            <RichTextInput
                fullWidth
                validate={[required()]}
                source="description"/>

            <NumberInput
                validate={[required()]}
                source="grantingTime" label="Tempo di assegnazione (in ore)"/>

            <DateInput source="expiresAt"/>

            <RestaurantRelatedRules/>

          </FormTab>
        </TabbedForm>
      </Create>
  )
});

export default PrizeCreate;
