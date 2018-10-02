import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable */
import classnames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { CreateController, ReferenceField, SimpleForm, RadioButtonGroupInput,
  FormDataConsumer, LongTextInput, ImageInput, ImageField, TextInput} from 'react-admin';
import {withStyles} from "@material-ui/core/styles";
import {get} from "lodash";
import {Card, CardHeader, CardIcon, CardBody, GridContainer,
  CustomButton as Button, SaveButton, GridItem, SwitchInput, SliderInput, Primary } from "business/components";
import EventField from "business/components/fields/EventField";

import moment from 'moment';
import styles from "business/assets/jss/views/broadcastCreateStyle";

import VersionedImageField from "business/components/fields/VersionedImageField";

import MuiToolbar from '@material-ui/core/Toolbar';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import BroadcastCreateForm from 'business/components/forms/BroadcastCreateForm';



function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class CreateBroadcastView extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      record: props.record
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(callback) {
    const self = this;
    callback(function(values) {
      return self.setState({record: values, modal: true});
    })();

  }
  handleModalClose(submit = false) {
    if (submit) {
      let record = this.state.record;
      record.event = record.event._id;
      record.business = this.props.business._id;

      this.props.save(this.state.record, "/events/list");
    }

    this.setState({modal: false});

  }

  render() {
    const {
      basePath,
      children,
      className,
      record = {},
      save,
      redirect,
      resource,
      classes,
      ...rest
    } = this.props;

    const finalRecord = this.state.record;
    if (!record.event) return null;
    const date = moment(record.event.start_at).format("D MMM YYYY");
    const time = moment(record.event.start_at).format("HH:mm");

    const calculateSpotCost = (finalRecord) => {
      console.log(finalRecord);
      return parseInt(finalRecord.event.spots + (finalRecord.offer && finalRecord.plus ? 150 : 0));
    }
    return (
      <div className={classnames('broadcast-create', className)}>
        <Dialog
          classes={{root: classes.center, paper: classes.modal}}
          open={this.state.modal}
          transition={Transition}
          keepMounted
          onClose={() => this.handleModalClose()}
        >

          <DialogTitle disableTypography className={classes.modalHeader}>
            <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.handleModalClose()}
            >
              <Close className={classes.modalClose} />
            </Button>
            <h4 className={classes.modalTitle}>Pubblica evento</h4>
          </DialogTitle><DialogContent
          id="modal-slide-description"
          className={classes.modalBody}>
          <h3>Pubblicare {finalRecord.event.name}?</h3>
          <p><div className={classes.eventDateTimeReview}>
              <span>{date}</span> alle
              <span>{time}</span>
            </div>
          </p>
          { finalRecord.offer &&
          <div className={classes.offerReview}>
            {finalRecord.plus &&
              <div className={classes.plusOfferReview}>
                <span className={classes.plusOfferReviewLabel}>Offerta plus</span>
                <h5 style={{fontWeight: 500}}>{finalRecord.offer.title}</h5>
                <p>{finalRecord.offer.description}</p>
              </div>
            }
            <p>Valore: <span className={classes.valueReview}>
              {finalRecord.offer.type === "0" ? "" : "-"}{finalRecord.offer.value}{finalRecord.offer.type === "0" ? "€" : "% alla cassa" }
            </span>
            </p>
          </div>
          }
          <p className={classes.spotReview}>La pubblicazione costerà <span>{calculateSpotCost(finalRecord)} spots</span></p>
        </DialogContent>

          <DialogActions
            className={classes.modalFooter +" " +classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleModalClose(false)}
              color="simple">
              Annulla
            </Button>
            <Button
              onClick={() => this.handleModalClose(true)}
              flat
              color="primary">
                Pubblica
            </Button>
          </DialogActions>
        </Dialog>
        <GridContainer >
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className={classes.eventCardHeader}>

                <CardIcon className={classes.eventCardIcon}>
                  <ReferenceField linkType={false} basePath={basePath} record={record.event} reference="competitions" source="competition">
                    <VersionedImageField
                      source="image_versions"
                      minSize={{width: 128, height: 128}} />
                  </ReferenceField>
                </CardIcon>
                <EventField record={record.event} basePath={"/events"} />



              </CardHeader>
              <CardBody className={classes.eventCardBody}>
                <div className={classes.eventDateTime}>
                  <span className={classes.eventDate}>{date}</span>
                  <span className={classes.eventTime}>{time}</span>
                </div>
                <div className={classes.eventDesc}>
                  {record.description}
                </div>
              </CardBody>
            </Card>

          </GridItem>

          <GridItem xs={12} sm={12} >
           <BroadcastCreateForm

             save={save}
             defaultValue={{event: record.event, offer: {type: "1", value: 10}}}
             onSubmit={this.handleSubmit} record={record}/>

          </GridItem>
        </GridContainer>
      </div>
    )
  }

}



const CreateBroadcast = props => (
  <CreateController { ...props}>
    {controllerProps => <CreateBroadcastView { ...props} { ...controllerProps}/>}
  </CreateController>
);



CreateBroadcast.propTypes = {
  business: PropTypes.object,
  actions: PropTypes.element,
  classes: PropTypes.element,
  children: PropTypes.element,
  className: PropTypes.string,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasShow: PropTypes.bool,
  resource: PropTypes.string.isRequired,
  title: PropTypes.any,
  record: PropTypes.object,
  hasList: PropTypes.bool,
};

const enhance = compose(
  connect((state, props) => ({
    business: state.business.data ? state.business.data.find(bus => bus._id == state.business.current) : null,
    saving: props.saving || state.admin.saving
  })),

  withStyles(styles)
);
export default enhance(CreateBroadcast);
