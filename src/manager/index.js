import { eventSystem } from '../EventSystem.ts';

let score = 0;

eventSystem.on('stopgame', function (v) {
    window.pc.app.destroy();
});

window.addEventListener('load', function () {
    console.log('window Loaded!!!');
    score = 0;
    // Wait for the PlayCanvas application to be ready
    if (window.pc && window.pc.app) {

        this.window.pc.app.on('game:init', function () {
            eventSystem.emit('init', 0);
        });

        // Listen for the "game:score" event
        window.pc.app.on('game:score', function (_score) {
            score = _score;
            eventSystem.emit('score', score);
        });

        window.pc.app.on('game:showleaderboard', function() {
            eventSystem.emit('getleaderboard', 0);
        });

        this.window.pc.app.on('game:showad', function(){
            eventSystem.emit('showad', 0);
        });

        this.window.pc.app.on('game:paywithstar', function(){
            eventSystem.emit('paywithstar', 0);
        });

        this.window.pc.app.on('game:connectWallet', function(){
            eventSystem.emit('connectWallet', 0);
        });

        this.window.pc.app.on('game:payTon', function(value){
            eventSystem.emit('payTon', value);
        });

        this.window.pc.app.on('game:disconnectWallet', function(){
            eventSystem.emit('disconnectWallet', 0);
        });

        this.window.pc.app.on('game:sharewithfriend', function(){
            eventSystem.emit('sharewithfriend', 0);
        });

        eventSystem.on('highscore', function (highScore) {

        //    console.log(`External High Score Send: ${highScore}`);
            
            window.pc.app.fire('external:highScoreSet', highScore);
        });

        eventSystem.on('setleaderboard', function(data){

            const playersData = [];

            data.sort((a, b) => b.Score - a.Score).map((value) => {
                let playerData = {
                    PlayerName: value.UserName,
                    PlayerScore: value.Score
                };

                playersData.push(playerData);
            });

            window.pc.app.fire('external:leaderboardSet', playersData);
        });

        // this.window.pc.app.on('game:gameover', function () {
        //     eventSystem.emit('gameover', score);
        // });
    } else {
        console.error('PlayCanvas application is not initialized.');
    }
});