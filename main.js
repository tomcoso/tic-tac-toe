// Tomas Dessy
// I couldnt make modules on multiple files work, I'm missing something
// but i dont want to skip lessons on TOP to learn about it. Just google wasn't helpful...

// pubsub module
let pubsub = {

    events: {},

    subscribe: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn); 
    },

    unsubscribe: function(eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0 ; i < this.events[eventName].length ; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },

    publish: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    },
};






// gameboard module
let gameboard = (function() {

    let gameboard = ['o', 'o', 'x', 'o', 'x', 'x', 'x', 'o', 'x']; ;
    let lastPlay = '';
    let firstMove = '';
    let players = [];
    let seeArray = function() {
        console.log(gameboard);
    };

    // Cache DOM
    let htmlBoard = document.querySelectorAll('.cell');

    let _getPlayers = function(data) {
        console.log(data);

        players = [];
        players.push(data[0]);
        players.push(data[1]);
    }

    let _clearArray = function() {

        gameboard.forEach((element, index) => {
            gameboard[index] = null;
        });

        _render();
    }
    


    let _render = function(player, position) {
        console.log('render:',player, position);

        if (player && position){ 
            for (let i = 0; i < htmlBoard.length ; i++) {

                if (htmlBoard[i] === position) {

                    let index = htmlBoard[i].attributes[1].value
                    let symbolIndex = player.length - 1;

                    if (gameboard[index] === null) {
                        gameboard[index] = player[symbolIndex];
                    } else if (player === players[0].id){
                        lastPlay = players[1].id;
                    } else {
                        lastPlay = players[0].id;
                    }
                }
            }
        }
        for ( let i = 0 ; i < gameboard.length ; i++ ) {
            htmlBoard[i].textContent = gameboard[i];
        }

        _checkStatus();
    }

    let _restart = function(players) {

        console.log('restart', players)

        _clearArray();

        firstMove = players[0].id;

        _getPlayers(players);
    }

    let _selectPlayer = function() {
        console.log('selectPlayer:')
        switch (lastPlay) {

            case players[0].id :
                lastPlay = players[1].id;
                _render(players[1].id, this);
                break;

            case players[1].id :
                lastPlay = players[0].id;
                _render(players[0].id, this);
                break;

            case '' :
                _render(firstMove, this);
                if (firstMove === players[0].id) {
                    lastPlay = players[0].id;
                }
                else {
                    lastPlay = players[1].id;
                }
                break;
        }
    }

    htmlBoard.forEach(each => each.addEventListener('click', _selectPlayer))

    let _checkStatus = function() {

        let boardMatch = '';
        for (let i = 0; i < gameboard.length ; i++) {
            if (gameboard[i] === null) {
                boardMatch += 'n';
            }
            else {
                boardMatch += gameboard[i];
            }
        }
        console.log('checkStatus');

            // match horizontal wins
        if (boardMatch.match(/(^((o){3}|(x){3}))|(((o){3}|(x){3})$)|(\S{3}((o){3}|(x){3})\S{3})/) ||

            // match vertical wins
            boardMatch.match(/((o(\S){2}){2}o)|((x(\S){2}){2}x)/) ||

            // match diagonal wins
            boardMatch.match(/((^(o(\S){3}){2}o)|((\S){2}(o(\S){1}){2}o(\S){2}))|((^(x(\S){3}){2}x)|((\S){2}(x(\S){1}){2}x(\S){2}))/)) {
            
            if (lastPlay === players[0].id) {
                pubsub.publish('statusChange', ['win', players[0]]);
            } else {
                pubsub.publish('statusChange', ['win', players[1]]);
            };

            // match tie
        } else if (!boardMatch.match(/n/)) {
            pubsub.publish('statusChange', ['tie']);
        }
    }

    pubsub.subscribe('newGame', _restart);
    pubsub.subscribe('makeMove', _render);
    pubsub.subscribe('newRound', _clearArray);

    return { seeArray, _restart, _checkStatus };
})(); 







// factory player
let Player = function(name, symbol) {

    this.name = name;
    this.id = `player${symbol.toLowerCase()}`;
    this.score = 0

    // pubsub.subscribe('changeStatus', _changeScore);

    // let _resetCount = function() {

    // }

    return { id, name, score };

}

let display = (function() {

    // cache DOM
    let player1Name = document.querySelector('.player1 p').textContent;
    let player2Name = document.querySelector('.player2 p').textContent;

    let player1Count = document.querySelector('.player1 .count');
    let player2Count = document.querySelector('.player2 .count');

    let player1Symbol = document.querySelector('.symbol1').textContent;
    let player2Symbol = document.querySelector('.symbol2').textContent;

    let startGamePanel = document.querySelector('.start-container');
    let startGameBtn = document.querySelector('#start-game');

    let changeStatusPanel = document.querySelector('.endgame-container');
    let changeStatusMsg = document.querySelector('.endgame-container p');
    let newRoundBtn = document.querySelector('#new-round');
    let newGameBtn = document.querySelector('#new-game');

    let _setPlayer = function() {

        let player1 = Player(player1Name, player1Symbol);
        let player2 = Player(player2Name, player2Symbol);

        console.log('setPlayer', player1, player2);

        return { player1, player2 };
    }

    let _startGame = function() {

        const { player1, player2 } = _setPlayer();

        pubsub.publish('newGame', [player1, player2]);

        startGamePanel.classList.add('hidden');
    }
    startGameBtn.addEventListener('click', _startGame);

    let _newRound = function() {

        changeStatusPanel.classList.toggle('hidden');
        pubsub.publish('newRound');

    }
    newRoundBtn.addEventListener('click', _newRound);

    let _newGame = function() {

        startGamePanel.classList.toggle('hidden');
        changeStatusPanel.classList.toggle('hidden');
        player1Count.textContent = 0
        player2Count.textContent = 0

    }
    newGameBtn.addEventListener('click', _newGame);

    let _statusHandler = function(data) {
        console.log('statusHandler', data)
        changeStatusPanel.classList.toggle('hidden');

        if (data[0] === 'win') {

            changeStatusMsg.textContent = `${data[1].name} wins this round!!`
            if (data[1].name === player1Name) {
                player1Count.textContent = +player1Count.textContent + 1;
            } else if (data[1].name === player2Name) {
                player2Count.textContent = +player2Count.textContent + 1;
            }
        }
        else if (data[0] === 'tie') {
            changeStatusMsg.textContent = "Its's a tie!!"
        }
    }
        
    pubsub.subscribe('statusChange', _statusHandler);

    return {  }
})();