import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './index.scss'

import axios from 'axios';
import {SERVER_MAIN_URL} from '../../config'

 
// Here, we display our Navbar
class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          totalSupply:1000000000,
          distributes:0,
          totalBalance:0,
          errors: {}
        };
        this.getDistributes = this.getDistributes.bind(this);
       
      }

    getDistributes(){
        axios
        .get(`${SERVER_MAIN_URL}/distributes/`)
        .then((response) => {
            console.log('the result of getDistributes method is ', response.data)
            this.setState({distributes: Number(response.data), totalBalance : this.state.totalSupply - Number(response.data)});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getDistributes();
    }
  render() {
  return (
    <div className="row">
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
        <aside className="sidebar sidebar-default navs-rounded ">
            
            <ul className="navbar-nav ms-auto navbar-list mb-2 mb-lg-0 align-items-center">
                <li className="nav-item ">
                        &nbsp;
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>Total Supply:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{this.state.totalSupply}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>Distributed token:</p>
                    <p  style={{color:'#1eff12', fontSize:22}}>{this.state.distributes}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>GAH Total Balance:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{this.state.totalBalance}</p>
                </li>
            
            </ul>
        </aside>
        </div>
    </div>
  );
  }
};
 
SideBar.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(SideBar);