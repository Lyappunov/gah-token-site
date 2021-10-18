import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './index.scss'
import { logoutUser } from "../../actions/authActions";
import avatar from "../../assets/images/06.png"


 
// Here, we display our Navbar
class MenuBar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
  render() {
    const { user } = this.props.auth;
  return (
    <div>
        <div className="position-relative">
            <nav className="nav navbar navbar-expand-lg navbar-light iq-navbar border-bottom" style={{minHeight:65, padding:0}}>
                <div className="container-fluid navbar-inner" style={{padding:0}}>
                    <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                        <i className="icon">
                        <svg width="20px" height="20px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                        </svg>
                        </i>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{float:'right'}}>
                        <span className="navbar-toggler-icon">
                            <span className="navbar-toggler-bar bar1 mt-2"></span>
                            <span className="navbar-toggler-bar bar2"></span>
                            <span className="navbar-toggler-bar bar3"></span>
                        </span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{background:'#303032'}}>
                        <ul className="navbar-nav ms-auto navbar-list mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item ">
                                <NavLink to="/home">Home</NavLink>
                            </li>
                            <li className="nav-item ">
                                <NavLink className="nav-link" to="/tokenbuy">Token Buying</NavLink>
                            </li>
                            <li className="nav-item ">
                                <NavLink className="nav-link" to="/tokensell">Token Sale</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={avatar} alt="User-Profile" className="img-fluid avatar avatar-50 avatar-rounded"/>
                                    <div className="caption ms-3 ">
                                        <h6 className="mb-0 caption-title">{user.name}</h6>
                                        <p className="mb-0 caption-sub-title">Super Admin</p>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li className="border-0"><a className="dropdown-item" href="/list">Profile</a></li>
                                    <li className="border-0"><a className="dropdown-item" href="/list">My Wallet</a></li>
                                    <li className="border-0"><hr className="m-0 dropdown-divider"/></li>
                                    <li className="border-0"><a className="dropdown-item" href="#" onClick={this.onLogoutClick}>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
  );
  }
};
 
MenuBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(MenuBar);