import React, { Component } from 'react';
import {
    Navbar
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

class AuthHeader extends Component{
    constructor(props){
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            width: window.innerWidth
        }
    }
    // function that sets the class to active of the active page
    activeRoute(routeName) {
        return window.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    }
    // function that shows/hides sidebar on responsive
    mobileSidebarToggle(e){
        document.documentElement.classList.toggle('nav-open');
    }
    updateWidth(){
        this.setState({width: window.innerWidth});
    }
    componentDidMount(){
        window.addEventListener("resize", this.updateWidth.bind(this));
    }
    render(){
        return (
            <Navbar collapseOnSelect inverse className="navbar-primary navbar-transparent navbar-absolute text-center">
                <Navbar.Header>
                    <Navbar.Brand>
                        <NavLink to={'/dashboard'} className="nav-link">
                            { this.state.width > 429 ? "SpotIn - Dashboard":"SpotIn" }
                        </NavLink>
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={this.mobileSidebarToggle} />
                </Navbar.Header>

            </Navbar>
        );
    }
}

export default AuthHeader;
