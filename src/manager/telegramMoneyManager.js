import { eventSystem } from '../EventSystem';
import * as payment from './payment.js';
import * as tgWebManager from '../../tgwebmanager.ts'
import * as tonConnectionHandler from '../ton-connection/tonconnectUIHandler.ts'

eventSystem.on('paywithstar', async function(v){
   await payWithStar();
});

eventSystem.on('connectWallet', async function(v){
    await connectWallet();
});

eventSystem.on('payTon', async function(v){
    await payTon(v);
});

eventSystem.on('disconnectWallet', async function(v){
    await disconnectWallet();
});

async function payWithStar(){
    // Star Payment System
    console.log("Pay With Star Clicked");

    const prices = [{ label: "Pay 10 Star", amount: 10 }];  // 100 Stars

    const result = await payment.starPaymentFetch("Gold Package","Purchase 200x Gold Package", prices);

    if(result.success){
        tgWebManager.openInvoiceLink(result.data);
    }
}

async function connectWallet(){
    // TON Payment System

    await tonConnectionHandler.openTonConnectUI();

    console.log("Pay With TON Clicked");
}

async function payTon(value) {
    try{
        const transactionResponse = await tonConnectionHandler.payTon(value);
        
        if(transactionResponse){
             console.log('Transaction SUCCESS RESPONSE:', transactionResponse);

             tonConnectionHandler.readTransactionResponse(transactionResponse);
        }
    }
    catch(e){
        console.log(e);
        console.log("TRANSACTION ERROR!");
    }
}

async function disconnectWallet() {
    await tonConnectionHandler.disconnectWallet();
}