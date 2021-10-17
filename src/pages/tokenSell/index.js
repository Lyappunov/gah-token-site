import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Web3 from "web3";

import 'react-confirm-alert/src/react-confirm-alert.css';
import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import {SERVER_MAIN_URL} from '../../config'
import "../../assets/css/common.css";

class TokenSell extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = { 
      ega_bnb: '',
      salelimit: '',
      limitega: 0,
      egaAmount : 0,
      bnbAmount : 0,
      errors: {}
    };
    this.getData = this.getData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  onChangeEGA = e => {
    this.setState({ egaAmount: e.target.value });
    var ega_bnb =  this.state.ega_bnb;
    var bnb_amount = Number(e.target.value) * ega_bnb;
    this.setState({ bnbAmount : bnb_amount.toFixed(6) })
  }

  onChangeBNB = e => {
    this.setState({ bnbAmount: e.target.value });
    var ega_bnb =  this.state.ega_bnb;
    var ega_amount = Number(e.target.value) / ega_bnb;
    this.setState({ egaAmount : ega_amount.toFixed(6) })
  }

  handleSubmit(e){
    e.preventDefault();
   
    if(Number(this.state.egaAmount) > Number(this.state.limitega)){
      alert(`You can sell the your token for maximum ${this.state.salelimit} USD (${this.state.limitega} EGA)`)
    }
  }
  // This method will get the data from the database.
  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.getData()
    this.getLimitedAmount()
    if (nextProps.errors) {
        this.setState({
            errors: nextProps.errors
        });
    }
  }

  getData(){
    axios
      .get(`${SERVER_MAIN_URL}/currentpairprice/1`)
      .then((response) => {
        console.log('the result of getData method is ', response.data)
        this.setState({ega_bnb: Number(response.data[0].ega_usd)});
        axios
          .get(`${SERVER_MAIN_URL}/limitamount`)
          .then((reslim) => {
            this.setState({salelimit: Number(reslim.data[0].saleMAX)});
            let limit_ega = (Number(reslim.data[0].saleMAX)/Number(response.data[0].ega_usd)).toFixed(6);
            this.setState({ limitega : limit_ega });
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div>
        <Header />
        <SideBar />
          <div className="container-fluid content-inner pb-0" style={{minHeight:680, minWidth:'100%', paddingLeft:'17%', paddingTop:245}}>
                <div className="row">
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header-tb" style={{paddingRight:70}}>
                                <h4 className="card-title text-white">Token Sale</h4>
                            </div>
                            <div style={{paddingLeft:25, paddingTop:25}}>
                                <p style={{color:'green'}}>* 1 GAH = {this.state.ega_bnb} USD </p>
                                <p style={{color:'green'}}>* 1 USD = {(1/this.state.ega_bnb).toFixed(6)} GAH </p>
                            </div>
                            <div className="d-flex mt-4 ms-4 me-4 justify-content-between" style={{paddingBottom : 20}}>
                            
                              <form onSubmit={this.handleSubmit} style={{width:'100%'}}>
                                <div className="modal-content">
                                      
                                      <div className="modal-body">
                                      
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="egaAmount" placeholder="0" onChange={this.onChangeEGA} value={this.state.egaAmount}/>
                                              <label>GAH Coin</label>
                                          </div>
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="bnbAmount" placeholder="0" onChange={this.onChangeBNB} value={this.state.bnbAmount}/>
                                              <label>USD</label>
                                          </div>
                                          <p style={{color:'grey'}}>* You can sell the your token for maximum {this.state.salelimit} USD ({this.state.limitega} GAH)</p>
                                      </div>
                                      <div className="modal-footer">
                                          {/* <button type="button" className="btn btn-secondary" onClick={this.editClose}>Close</button> */}
                                          <button type="submit" className="btn btn-primary">Sale</button>
                                      </div>
                                </div>
                              </form>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
      </div>
    );
  }
}

TokenSell.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(TokenSell);
