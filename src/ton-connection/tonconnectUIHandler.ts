import { ActionConfiguration, SendTransactionRequest, TonConnectUI, Wallet }  from '@tonconnect/ui';

const host = 'https://yaver-496.github.io/IA-Entertainment-Dapp/';

let tonConnectUI : TonConnectUI;

tonConnectUI = new TonConnectUI(
{ 
    manifestUrl: 'https://yaver-496.github.io/IA-Entertainment-Dapp/tonconnect-manifest.json'
}); 

(async function run() {

    const isConnectionRestored = await tonConnectUI.connectionRestored;

    console.log('isConnectionRestored:',isConnectionRestored);

    tonConnectUI.onStatusChange(console.log);
})();

export async function openTonConnectUI(){

    if(tonConnectUI){

        if(tonConnectUI.connected){
            console.log("Wallet Connected:", tonConnectUI.wallet);

            return tonConnectUI.wallet;
        }else{
            await tonConnectUI.openModal();

            return tonConnectUI.wallet;
        }
    }
}

export async function payTon(value: any) {
    
    if(tonConnectUI){

        const wallet = await openTonConnectUI();

        if(wallet){

            console.log('wallet is here:', wallet);

            const message = "hello world";

           return await sendTransaction(wallet, value, message);
        }
    }
}

async function sendTransaction(wallet: Wallet, amount: number, message: string) {
    
    const response = await (
        await fetch(`${host}/api/generate_payload`, {
          method: 'POST',
        })
      ).json();

      console.log('response:', response);

    const transactionRequest : SendTransactionRequest = {
        /**
         * Sending transaction deadline in unix epoch seconds.
         */
        validUntil: Math.floor(Date.now() / 1000) + 600,
        /**
         * The network (mainnet or testnet) where DApp intends to send the transaction. If not set, the transaction is sent to the network currently set in the wallet, but this is not safe and DApp should always strive to set the network. If the network parameter is set, but the wallet has a different network set, the wallet should show an alert and DO NOT ALLOW TO SEND this transaction.
         */
        network: wallet?.account.chain,
        /**
         * The sender address in '<wc>:<hex>' format from which DApp intends to send the transaction. Current account.address by default.
         */
        from: wallet?.account.address, 
        /**
         * Messages to send: min is 1, max is 4.
         */
        messages:[ {
            /**
             * Receiver's address.
             */
            address: "0QDhUkpler_hV1u85Q8xO2qv28W3fQkTo3TzgEMJ5Ext3eRo",
            /**
             * Amount to send in nanoTon.
             */
            amount: (amount * 1000000).toString()

         //   payload: base64Payload
        }]
    };

    const modalOption : ActionConfiguration = {
        modals: ['before', 'success', 'error'],
        notifications: ['before', 'success', 'error']
    };

   return await tonConnectUI.sendTransaction(transactionRequest, modalOption);
}

export function readTransactionResponse(transactionResponse: { boc: any; }) {
    console.log('Transaction was sent successfully:', transactionResponse.boc);
}

export async function disconnectWallet(){

    if(tonConnectUI.connected){
       await tonConnectUI.disconnect();
    }else{
        console.log('There is no Connected Wallet.');
    }
}
