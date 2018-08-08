import React from 'react';
import { connect } from 'react-redux';
import { getAllSports, getFavoriteSports } from 'actions/sports';
import SportList from 'components/Sports/SportList';
import PropTypes from 'prop-types';


class SportsPage extends React.Component {

  constructor() {
    super();
    this.handleItemPress = this.handleItemPress.bind(this);
  }

  componentDidMount() {

    const { sports } = this.props;

    //Chiamata condizionata solo se sport non e' presente nello stato redux

    if(!sports || sports.length === 0){
      this.props.dispatch(getAllSports());
    }



  }
  handleItemPress(item) {

  }
  render() {

    const { sports } = this.props;

    if(!sports || sports.length === 0) return null;

    return (
      <div className="main-content">
        <SportList sports={sports} onItemPress={this.handleItemPress}/>
      </div>


    )
  }
}

SportsPage.propTypes = {
  currentlySending: PropTypes.bool,
  sports: PropTypes.array.isRequired,
  loggedIn: PropTypes.bool
};

const mapStateToProps = state => {
  return({
    currentlySending: state.sports.currentlySending,
    sports: state.sports.sports,
    loggedIn: state.auth.loggedIn
  })
}

export default connect(mapStateToProps)(SportsPage)
