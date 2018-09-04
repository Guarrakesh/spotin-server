import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { crudGetAll as crudGetAllAction, translate, registerResource as registerResourceAction, userLogout as userLogoutAction} from 'react-admin';
import { connect } from 'react-redux';
import { getUserBusinesses as getUserBusinessAction} from '../actions/business';
// @material-ui/core components
/* eslint-disable */
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// core components
import GridContainer from "business/components/material-ui/Grid/GridContainer.js";
import GridItem from "business/components/material-ui/Grid/GridItem.js";
//import Table from "business/components/material-ui/Table/Table.js";
//import Button from "business/components/material-ui/CustomButtons/Button.js";
import Danger from "business/components/material-ui/Typography/Danger.js";
import Card from "business/components/material-ui/Card/Card.js";
import CardHeader from "business/components/material-ui/Card/CardHeader.js";
import CardIcon from "business/components/material-ui/Card/CardIcon.js";
//import CardBody from "business/components/material-ui/Card/CardBody.js";
import CardFooter from "business/components/material-ui/Card/CardFooter.js";
import Warning from "@material-ui/icons/Warning";
import authProvider from '../../../providers/authProvider';
import dashboardStyle from "business/assets/jss/material-dashboard-pro-react/views/dashboardStyle";
/* eslint-enable */



class Dashboard extends React.Component {
  state = {attempts: 0}
  componentDidMount() {
    this.props.registerResource({
      name: 'businesses'
    });

  }
  componentDidUpdate() {
    const { businesses, getUserBusinesses, loading } = this.props;

    if (Object.keys(businesses.data).length <= 1 && !loading && this.state.attempts < 2) {

      authProvider('AUTH_GET_USER').then((user) => {
        const attempts = this.state.attempts;
        this.setState({attempts: attempts + 1});
        getUserBusinesses(user._id);
      }).catch(() => {
        userLogoutAction();
      });

    }

  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Used Space</p>
                <h3 className={classes.cardTitle}>
                  49/50 <small>GB</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    Get more space
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    )

  }
}


Dashboard.propTypes = {
  registerResource: PropTypes.object,
  businesses: PropTypes.object,
  crudGetAll: PropTypes.func,
  loading: PropTypes.number,
  getUserBusinesses: PropTypes.func
}
const mapStateToProps = state => ({
  businesses: state.admin.resources.businesses,
  loading: state.admin.loading,

});
const enhance = compose(
  translate,
  connect(
    mapStateToProps,
    {
      crudGetAll: crudGetAllAction,
      registerResource: registerResourceAction,
      userLogout: userLogoutAction,
      getUserBusinesses: getUserBusinessAction
    }
  ),
  withStyles(dashboardStyle)
)
Dashboard.propTypes = {
  classes: PropTypes.string,

}
export default enhance(Dashboard);
