import WebApp from '@twa-dev/sdk'
import * as Database from './src/manager/database.js';
import { eventSystem } from './src/EventSystem.js';
import * as referralManager from './src/manager/telegramReferralManager.js';

eventSystem.on('init', async function (v) {
    await start();
});

eventSystem.on('getleaderboard', async function(v) {
    await sendLeaderboard();
    WebApp
})

eventSystem.on('score', async function (score) {
    await updatePlayerScore(score);
});

let currentPlayer;

async function updatePlayerScore(_targetScore) {

    if (_targetScore > currentPlayer.Score) {
        currentPlayer.Score = _targetScore;

        await Database.updateData(currentPlayer);

        await setPlayerHighScore(_targetScore);
    }
}

async function setPlayerHighScore(highScore: number) {
    console.log(`High Score Update: ${highScore}`);

    eventSystem.emit('highscore', highScore);
}

async function start() {

  //  if (isNotAvailablePlatform(WebApp.platform)) { return; }

    WebApp.onEvent('viewportChanged', (isStateStable) => {
        console.log("isStateStable: ", isStateStable);
        
        if (!WebApp.isExpanded) {
            WebApp.expand();
        }
    });
    
    const tgUnsafeData = WebApp.initDataUnsafe;
    const tgUser = tgUnsafeData.user;
    
    if (tgUser) {

        WebApp.expand();

        const userID = tgUser.id ? tgUser.id : 0;

        const userFirstName = tgUser.first_name ? tgUser.first_name : `Player ${userID}`;

        // Get User Data
        const _currentUser = await Database.getData(userID);

        // Check User is not Exist
        // Add as New User
        if (_currentUser == 'data_not_found') {

            WebApp.showAlert('Hello New Player ' + userFirstName);
            
            const newUser = {
                UserID: userID,
                UserName: userFirstName,
                Score: 0
            };

            const result = await Database.insertData(newUser);
            console.log(result);

            currentPlayer = newUser;
        } else {
            _currentUser.UserName = userFirstName;

            currentPlayer = _currentUser;
        }

        // console.log(currentPlayer);
    }
    else {
        const _currentUser = await Database.getData(0);

        if (_currentUser == 'data_not_found') {
            const newUser = {
                UserID: 0,
                UserName: "Non Telegram User",
                Score: 0
            };

            const result = await Database.insertData(newUser);
            console.log(result);

            currentPlayer = newUser;
        } else {
            currentPlayer = _currentUser;
        }
    }

    await setPlayerHighScore(currentPlayer.Score);
}

async function sendLeaderboard() {
    const _allUsers = await Database.getAllUsers();

    eventSystem.emit('setleaderboard', _allUsers);
}

function isNotAvailablePlatform(currentPlatform) { return (currentPlatform == 'tdesktop') || (currentPlatform == 'weba') || (currentPlatform == 'webk') || (currentPlatform == 'unigram') || (currentPlatform == 'unknown'); }

(async function awake() {
    const tgUnsafeData = WebApp.initDataUnsafe;
    const tgUser = tgUnsafeData.user;
    
    // if (isNotAvailablePlatform(WebApp.platform)) {

    //     eventSystem.emit('stopgame', 0);

    //     const popupParam = {
    //         title: 'Desktop Error',
    //         message: "Open Game on Mobile"
    //     };

    //     WebApp.showPopup(popupParam);

    //     WebApp.close();
    //     return;
    // }
    
    if (tgUser) {
        WebApp.enableClosingConfirmation();

        WebApp.expand();

        const no_param = 'no_param';
        const startParam = WebApp.initDataUnsafe.start_param ? WebApp.initDataUnsafe.start_param : no_param;

        if(startParam !== no_param){
            // This user is using referral link to join to game
            // Give some prize
            referralManager.referralFound(startParam);
            console.log('You Used Referral Link to join to game, you have earned some prize!', startParam);
        }
    }
})();


export function getUserID() { return currentPlayer.UserID; }

export function openInvoiceLink(invoiceLink) { 

    WebApp.openInvoice(invoiceLink, (invoiceStatus) =>{
        console.log("INVOICE_STATUS:", invoiceStatus);

        if(invoiceStatus == "paid"){
            console.log("Star Payment Success!");
        }
    });
 }

 export function openURLLinkInTelegram(link){
    WebApp.openTelegramLink(link);
 }