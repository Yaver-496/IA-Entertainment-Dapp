import { eventSystem } from '../EventSystem';
import * as tgwebManager from '../tgwebmanager.ts'

export function referralFound(id) {
    console.log("Referral ID:", id);
}

eventSystem.on('sharewithfriend', async function(v){
    console.log("sharewithfriend");
    await shareWithFriend();
});

async function shareWithFriend(){
    // Share with friend logic
    console.log('Share With Friend Clicked!');

    const userId = tgwebManager.getUserID();
    const referralLink = `https://t.me/KeepyUp_bot/gaming?startapp=${userId}`; 
        
    // Copy referral link to clipboard
    await navigator.clipboard.writeText(referralLink).then(function() {
        console.log('Referral link copied to clipboard:', referralLink);        
        // Open Telegram with a message
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Check out this amazing app!')}`;
       // window.open(telegramShareUrl, '_blank');
       tgwebManager.openURLLinkInTelegram(telegramShareUrl);
    }).catch(function(err) { console.error('Failed to copy referral link:', err); });
}