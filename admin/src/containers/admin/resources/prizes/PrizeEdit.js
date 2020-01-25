import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import { TabbedForm,TextInput, required, DateInput, ImageField, ImageInput, NumberInput, Edit, FormTab } from 'react-admin';

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
const PrizeEdit = withStyles(styles)(({classes, ...props}) => {
  return (
      <Edit { ...props}>
        <TabbedForm>
          <FormTab label="General">
            <TextInput disabled source="_id"/>
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
            <TextInput
                fullWidth
                validate={[required()]}
                source="description"/>

            <NumberInput
                validate={[required()]}
                source="grantingTime" label="Tempo di assegnazione (in ore)"/>

            <DateInput source="expiresAt"/>

            <RestaurantRelatedRules/>
            <NumberInput source="order"/>

          </FormTab>
        </TabbedForm>
      </Edit>
  )
});

export default PrizeEdit;
