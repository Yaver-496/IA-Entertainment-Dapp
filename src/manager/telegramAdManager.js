import { eventSystem } from '../EventSystem';

const AdController = window.Adsgram.init({ blockId: "1316",
                                           debug: true,
                                           debugBannerType: "FullscreenMedia"
                                         });

eventSystem.on('showad', function(v){
    showAd();
});

function showAd()
{
    console.log('Show Ad'); 

    AdController.show().then((result) => {
        // user watch ad till the end
        // your code to reward user
        console.log("Ad Result: ",result);
    }).catch((error) => {
        // user get error during playing ad or skip ad
        // do nothing or whatever you want
        console.log("Ad Error: ", error);
    });
}                                         