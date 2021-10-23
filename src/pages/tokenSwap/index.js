import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import PaypalButton from '../../components/paypal/paypalButton';
import PaymentBox from '../../components/BTC/paymentBox';
import './index.scss'

import Web3 from "web3";
import {BACKEND_URL} from '../../global/config'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
    },
  },
}));

// const stripePromise = loadStripe("pk_test_51IzTMJF1cOJreNKh78LrrhTY7mYt7NpOnSSKfYjoJtttFvAchGI4IuYGJDbQU3E5PwToWFbSV6g4iZE2JQhkKMDn00VDqjegXn");


export default function TokenSwap() {
  const { user } = useSelector(state => state.auth);
  console.log('current users info is ', user)
  const classes = useStyles();

  const [value, setValue] = React.useState('btc');
  const [price, setPrice] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [sendingComplete, setSendingComplete] = useState(false);

  const [ega_usd, setEgaUsd] = useState(0);
  const [ega_eur, setEgaEur] = useState(0);
  const [ega_mos, setEgaMos] = useState(0);
  const [buyLimit, setBuyLimit] = useState();
  const [limitUSD, setLimitUSD] = useState();
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');


  const getCurrentDate = () => {
    var today = new Date();
    var thisyear = today.getFullYear();
    var thisMonth = today.getMonth()<10?'0'+(today.getMonth() + 1):(today.getMonth() + 1);
    var thisDay = today.getDate()<10?'0'+(today.getDate()):today.getDate();
    var thisMonthToday = thisyear+'-'+thisMonth+'-'+thisDay;
    var Hours = today.getHours()<10?'0'+today.getHours():today.getHours();
    var Minutes = today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
    var Seconds = today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
    var time = Hours+ ":" + Minutes + ":" + Seconds;
    var currentDateTime = thisMonthToday + 'T' + time + 'Z';
    return currentDateTime ;
  }
  const getData = () =>{
    axios
      .get(`${BACKEND_URL}/currentpairprice/1`)
      .then((response) => {
        console.log('the result of getData method is ', response.data)
        setEgaUsd(Number(response.data[0].ega_usd));
        setEgaMos(Number(response.data[0].ega_mos));
        setEgaEur(Number(response.data[0].ega_eur));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const savingToDatabase = () => {
    var datetime =  getCurrentDate();
    let swappingData = {
        name:user.name,
        walletAddress:'gah-'+user.id,
        fromToken: selectedFrom,
        toToken: selectedTo,
        fromAmount: fromAmount,
        toAmount: toAmount,
        swapDate:datetime
    }
    axios
        .post(`${BACKEND_URL}/record/swapping`, swappingData)
        .then(res =>{
            alert('Your swapping is successful !');
        }
            
        ).catch(err =>{
            
            alert('Token has some problems. So, you failed to save your token.')
        }
        
    );
  }

  const handleChangeSelectFrom = (event) => {
    setSelectedFrom(event.target.value);
    if(event.target.value=='gah') {
        let fromAmountBump = fromAmount;
        setSelectedTo('mos');
        setToAmount((fromAmountBump*ega_mos).toFixed(5));
    }
    if(event.target.value=='mos') {
        setSelectedTo('gah');
        let fromAmountBump = fromAmount;
        setToAmount((fromAmountBump/ega_mos).toFixed(5));
    }
  }

  const onChangeFromAmount = e => {
    setFromAmount(e.target.value);
    if(selectedFrom == 'gah') setToAmount((e.target.value * ega_mos).toFixed(5));
    if(selectedFrom == 'mos') setToAmount((e.target.value / ega_mos).toFixed(5));
  }


const sendToken = async (tokenAmount) => {
    savingToDatabase(tokenAmount);    
}

const handleSubmit =(e) =>{
    e.preventDefault();
    savingToDatabase();  
}

useEffect(()=>{
    getData();
}, [])

  return (
    <div>
        <Header />
        <SideBar />
        <div className='row' style={{minHeight:680, minWidth:'100%', paddingLeft:'17%', paddingTop:245}}>
            
            <form style={{width:'60%', margin:'auto', marginTop:15}} onSubmit={handleSubmit}>
                <div className='card'>
                    <div className='card-header-tb'>
                        Token Swaping 
                    </div>
                    <div className='card-body'>
                        <div style={{paddingLeft:25}}>
                            <p style={{color:'green'}}>* 1 GAH = {(ega_mos).toFixed(6)} ECFA </p>
                            <p style={{color:'green'}}>* 1 ECFA = {(1/(ega_mos)).toFixed(6)} GAH </p>
                        </div>
                        <div className='textfield'>
                            <p>From Token : </p>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <Select
                                    value={selectedFrom}
                                    onChange={handleChangeSelectFrom}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'gah'}>GAH TOKEN</MenuItem>
                                    <MenuItem value={'mos'}>MOS TOKEN</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField id="standard-basic" type="number" variant="outlined" value={fromAmount} onChange={onChangeFromAmount} min={50}/>
                            <p> {selectedFrom.toUpperCase()}</p>
                            
                        </div>
                        <br/>
                        <div className='textfield'>
                            <p>To token : </p>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <Select
                                    value={selectedTo}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    disabled
                                >
                                <MenuItem value=''>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'gah'}>GAH TOKEN</MenuItem>
                                <MenuItem value={'mos'}>MOS TOKEN</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField id="standard-basic" type="number" variant="outlined" value={toAmount} min={50} disabled/>
                            <p> {selectedTo.toUpperCase()}</p>
                        </div>

                    </div>
                    <div className='card-footer'>
                        <button type="submit" className="btn btn-primary">Swap</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}