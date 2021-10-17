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


export default function TokenBuy() {
  const { user } = useSelector(state => state.auth);
  console.log('current users info is ', user)
  const classes = useStyles();

  const [value, setValue] = React.useState('btc');
  const [price, setPrice] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [sendingComplete, setSendingComplete] = useState(false);

  const [token, setToken] = useState('');

  const [ega_usd, setEgaUsd] = useState();
  const [ega_mos, setEgaMos] = useState();
  const [buyLimit, setBuyLimit] = useState();
  const [limitUSD, setLimitUSD] = useState();
  const [selectedCrypto, setSelectedCrypto] = useState();
  const [cryptoAmount, setCryptoAmount] = useState('');
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
        axios
          .get(`${BACKEND_URL}/limitamount`)
          .then((reslim) => {
            setBuyLimit(Number(reslim.data[0].buyMIN))
            let limit_usd = (Number(reslim.data[0].buyMIN)*Number(response.data[0].ega_usd)).toFixed(6);
            setLimitUSD(limit_usd);
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const savingToDatabase = (amount) => {
    var datetime =  getCurrentDate();
    const transactionData = {
        personName:'',
        phoneNumber:'',
        walletAddress: '',
        tranDate:datetime,
        tokenName:token,
        tranType:'BUY',
        amount : amount
    }
    axios
        .post(`${BACKEND_URL}/record/tranadd`, transactionData)
        .then(res =>{
            
            window.location.href = '/btc-success'
        }
            
        ).catch(err =>{
            
            alert('Token has some problems. So, you failed to save your token.')
        }
        
    );
  }
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeSelect = (event) => {
    setToken(event.target.value);
  };

  const onChangeCryptoAmount = e => {
      console.log('here is okay', e.target.value)
    setCryptoAmount(e.target.value);
    // if(token == 'gah'){
    //     var usd_amount = Number(e.target.value) * ega_usd;
    //     setUsdtAmount(usd_amount.toFixed(5))
    //     setPrice(usd_amount.toFixed(5));
    // }
    // if (token == 'mos'){
    //     var usd_amount = Number(e.target.value) * (ega_usd/ega_mos);
    //     setUsdtAmount(usd_amount.toFixed(5))
    //     setPrice(usd_amount.toFixed(5));
    // }
  }

  const onChangeUSDAmount = e => {
    setUsdtAmount(e.target.value);
    setPrice(e.target.value);
    if(token == 'gah'){
        var crypto_amount = Number(e.target.value) / ega_usd;
        setCryptoAmount(crypto_amount);
    }
    if(token == 'mos'){
        var crypto_amount = Number(e.target.value) / (ega_usd/ega_mos);
        setCryptoAmount(crypto_amount);
    }
  }

const sendToken = async (tokenAmount) => {
    savingToDatabase(tokenAmount);    
}

const handleSubmit =(e) =>{
    e.preventDefault();
    if (cryptoAmount<buyLimit){
        alert("Sorry but, you need to purchase the tokens of minimum " + buyLimit + ' ' + token.toUpperCase());
    }
    else handleOpen();
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
                        Token Buying 
                    </div>
                    <div className='card-body'>
                        <div className='textfield'>
                            <p>Token Amount : </p>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <Select
                                    value={token}
                                    onChange={handleChangeSelect}
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
                            <TextField id="standard-basic" type="number" variant="outlined" value={cryptoAmount} onChange={onChangeCryptoAmount} min={50}/>
                            <p> {token.toUpperCase()}</p>
                            
                        </div>
                        <p style={{color:'grey'}}>* You need to purchase the tokens of minimum {buyLimit} cryto ({limitUSD} USD)</p>
                        <br/>
                        <div className='textfield'>
                            <p>Price : </p>
                                <TextField id="filled-basic" type="number" variant="outlined" value={price} onChange={onChangeUSDAmount}/>
                            <p> USD</p>
                        </div>
                    
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Select Payment!</FormLabel>
                            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                                {/* <FormControlLabel value="stripe" control={<Radio />} label="Credit Cart" /> */}
                                <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                                <FormControlLabel value="btc" control={<Radio />} label="BitCoin" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='card-footer'>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            type='submit'
                        >
                            Buy Now
                        </Button>
                        
                    </div>
                </div>
            </form>
    
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    
                    {value === 'paypal' ? 
                        <PaypalButton 
                            sendToken={sendToken}
                            amount={cryptoAmount} 
                            price={price}
                            sendingComplete = {sendingComplete}
                            setSendingComplete = {setSendingComplete}
                        />: 
                        <PaymentBox
                            sendToken={sendToken}
                            amount={cryptoAmount} 
                            price={price}
                            sendingComplete = {sendingComplete}
                            setSendingComplete = {setSendingComplete}
                        /> 
                    }
                    
                </Fade>
            </Modal>
        </div>
    </div>
  );
}