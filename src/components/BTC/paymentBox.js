import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import {BACKEND_URL, MY_WALLET_ADDRESS} from '../../global/config'

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
const GreenCheckbox = withStyles({
    root: {
      color: '#1effbc',
      '&$checked': {
        color: '#1effbc',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

export default function PaymentBox(props) {
    const [recipientAddress, setRecipientAddress] = useState(MY_WALLET_ADDRESS);
    const [senderAddress, setSenderAddress] = useState('');
    const [senderPrivateKey, setSenderPrivateKey] = useState('');

    const classes = useStyles();
    
    const onChangeAddress = (e) => {
        setSenderAddress(e.target.value);
    };

    const onChangePrivatekey = (e) => {
        setSenderPrivateKey(e.target.value);
    };
    
    const handleSubmit =(e)=>{
        e.preventDefault();
       
        let sendBTCData = {
          recipientAddress: recipientAddress,
          senderAddress:senderAddress,
          senderPrivateKey: senderPrivateKey,
          amountToSend: props.price
          };
        axios
        .post(`${BACKEND_URL}/record/sendbitcoin`, sendBTCData)
        .then ((res) => {
          this.saveSubscribeDatabase()
        })
      }
    
    return (
        <div style={{width:'60%', backgroundColor:'grey', color:'white', borderRadius:5, minHeight:350}}>
            <div style={{width:'100%', textAlign:'center', margin:'auto', paddingTop:40, minHeight:350, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                <div style={{paddinBottom:25}}>
                    <h2>E-FRANC token amounts : {props.amount} EFRANC</h2>
                    <h2>Price :  {props.price} BTC</h2>
                </div>
                
                <form onSubmit={this.handleSubmit} style={{width:'100%'}}>
                    <div style={{padding:20, display:'inline'}}>
                        <span style={{color:'white', fontSize:'18px', fontWeight:700, justifyContent:'center'}}>Wallet Address : </span>
                        <TextField
                            placeholder="Please input your BTC wallet address"
                            variant="outlined"
                            onChange={onChangeAddress}    
                        />
                    </div>
                    <div style={{padding:20, display:'inline'}}>
                        <span style={{color:'white', fontSize:'18px', fontWeight:700, justifyContent:'center'}}>Private Key : </span>
                        <TextField
                            placeholder="Please input the private key."
                            variant="outlined"
                            onChange={onChangePrivatekey}    
                        />
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            type="submit"
                            onClick={handleSubmit}
                            
                        >
                            {`PAY (${props.price} BTC)`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

}