import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, getFormValues } from 'redux-form'; //eslint-disable-line
import { connect } from 'react-redux'; // eslint-disable-line
import compose from 'recompose/compose';
import classnames from 'classnames';

import {withStyles} from "@material-ui/core/styles";

//React admin
import { getDefaultValues, translate, REDUX_FORM_NAME , RadioButtonGroupInput,
  FormDataConsumer, LongTextInput, ImageInput, ImageField, TextInput} from 'react-admin';
  // Components
  import {Card, CardHeader, CardIcon, CardBody, CardFooter, GridContainer,
    CustomButton as Button, GridItem, SwitchInput, SliderInput, Primary } from "business/components";
    import SpotIcon from 'business/assets/img/SpotinIcon-outline';
    import styles from "business/assets/jss/views/broadcastCreateStyle";
    import { primaryColor } from 'business/assets/jss/material-dashboard-pro-react';
    import CircularProgress from '@material-ui/core/CircularProgress';
    import TurnedIn from "@material-ui/icons/TurnedIn";

    /* eslint-disable */
    const sanitizeRestProps = ({
      anyTouched,
      array,
      asyncBlurFields,
      asyncValidate,
      asyncValidating,
      autofill,
      blur,
      change,
      clearAsyncError,
      clearFields,
      clearSubmit,
      clearSubmitErrors,
      destroy,
      dirty,
      dispatch,
      form,
      handleSubmit,
      initialize,
      initialized,
      initialValues,
      pristine,
      pure,
      redirect,
      reset,
      resetSection,
      save,
      submit,
      submitFailed,
      submitSucceeded,
      submitting,
      touch,
      translate,
      triggerSubmit,
      untouch,
      valid,
      validate,
      ...props
    }) => props;
    /* eslint-enable */


    export class BroadcastCreateForm extends Component {

      handleClick(e) {
        const { saving } = this.props;
        if (saving) {
          e.preventDefault();
        } else {
          if (e)
          e.preventDefault();
          this.props.onSubmit(this.props.handleSubmit);

        }
      }
      render() {
        const {
          className,
          classes,
          redirect,
          saving,
          ...rest

        } = this.props;

        return (
          <form className={classnames('create-broadcast-form', classes.form, className)}
            {...sanitizeRestProps(rest)}
            >
            <Card >
              <CardHeader color="primary "icon className={classes.cardTitle}>
                <CardIcon color="primary">
                  <TurnedIn/>
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Pubblica evento</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem sm={12} md={10}>
                    <SwitchInput
                      className={classes.plusOfferSwitch}
                      source="plus"

                      label="Attiva l'offerta plus (+150 spots)"/>

                    <FormDataConsumer>
                      {({formData}) => {

                        return  [
                          <div key="plus-form" className={classnames(classes.plusOfferContainer, !formData.plus ? classes.plusOfferDisabled : "")}>

                            <Primary>{"Con l'offerta plus puoi caricare un'immagine offerta e una descrizione dettagliata. In più\
                              la tua offerta sarà visualizzata sulla bacheca dell'app Spot In"} </Primary>
                            <TextInput
                              className={classes.offerTitleFormControl}
                              disabled={!formData.plus === true}
                              label="Titolo offerta" source="offer.title"/>
                            <RadioButtonGroupInput
                              disabled={!formData.plus === true}
                              source="offer.type"
                              label="Tipo di offerta"
                              choices={[{id: "0", name: "Prezzo fisso"}, {id: "1", name: "Sconto in percentuale"}]} />

                            <LongTextInput
                              disabled={!formData.plus === true}
                              label="Descrizione offerta" source="offer.description"/>

                            <ImageInput
                              disabled={!formData.plus === true} source="picture" label="Immagine offerta" accept="image/*">
                              <ImageField source="image_url"/>
                            </ImageInput>
                          </div>
                          ,
                          formData.offer && <SliderInput
                          key="value-input"
                          noUiProps={{
                            format: {
                              to: (value) => formData.offer.type === "1" ? `${Math.round(value)}%` : `${Math.round(value)}€`,
                              from: (value) => formData.offer.type === "1" ? parseInt(value.replace('%', '')) : parseInt(value.replace('€', ''))
                            }

                          }}

                          className={classes.offerValueSlider} source="offer.value"
                          label={formData.plus && formData.offer.type === "0" ? "Prezzo" : "Sconto (%)"}/>


                      ]}}
                    </FormDataConsumer>

                  </GridItem>
                  <GridItem justify="center" alignContent="center" alignItems="center" sm={12} md={2}>

                    <FormDataConsumer>

                      {({formData}) => {

                        return (
                          <div className={classes.spotBoxContainer}>
                            <h3>Checkout</h3>

                            <h4 className={classes.subTotalSpot}>{formData ? formData.event.spots : 0}
                              <SpotIcon width="15" height="15" color={primaryColor}/>
                            </h4>
                            {formData.plus &&
                              <div className={classes.additionalSpots}>

                                <p>{`+ 150 Offerta Plus`}</p>
                                <div className={classes.totalSpots}>
                                  {formData.event.spots + 150 } <SpotIcon width="15" height="15" color={primaryColor}/>
                              </div>
                            </div>

                          }
                        </div>
                      )

                    }}
                  </FormDataConsumer>

                </GridItem>

              </GridContainer>
            </CardBody>
            <CardFooter className={classes.submitFooter}>

              <Button

                onClick={this.handleClick.bind(this)}
                type="submit"
                round
                color="primary"
                className={classes.submitButton}
                >
                {saving && saving.redirect === redirect ? (
                  <CircularProgress
                    size={25}
                    thickness={2}
                    className={classes.iconPaddingStyle}
                    />
                ) : (
                  null//<ContentSave className={classes.iconPaddingStyle} />
              )}
              {"Pubblica evento"}
            </Button>
          </CardFooter>

        </Card>
      </form>
    )
  }
}

BroadcastCreateForm.propTypes = {
  saving: PropTypes.bool,
  save: PropTypes.func,
  handleSubmit: PropTypes.func,
  record: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  onSubmit: PropTypes.func,
  formData: PropTypes.object,
  redirect: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),

}
const enhance = compose(
  connect((state, props) => ({
    form: props.form || REDUX_FORM_NAME,
    initialValues: getDefaultValues(state, props),
    saving: props.saving || state.admin.saving,

  })),
  translate,
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  }),
  withStyles(styles)
);

export default enhance(BroadcastCreateForm);
