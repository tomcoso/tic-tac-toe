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

    let gameboard = ['', '', '', '', '', '', '', '', '']; ;
    let lastPlay = '';
    let firstMove = '';
    let players = [];
    let seeArray = function() {
        console.log(gameboard);
    };

    // Cache DOM
    let htmlBoard = document.querySelectorAll('.cell');

    let _getPlayers = function(data) {

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

        if (player){ 
            for (let i = 0; i < htmlBoard.length ; i++) {

                if (htmlBoard[i] === position || htmlBoard[i].attributes[1].value == position) {

                    let index = htmlBoard[i].attributes[1].value
                    let symbolIndex = player.length - 1;

                    if (gameboard[index] === null) {
                        gameboard[index] = player[symbolIndex];
                        pubsub.publish('playerTurn');
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

        let aiTurn = _checkStatus();

        if (players[1]) {
            if (players[1].name === 'AI' && lastPlay === players[0].id && !aiTurn) {
                pubsub.publish('aiTurn', gameboard);
            }
        }
    }

    let _restart = function(players) {
        
        firstMove = players[0].id;
        lastPlay = '';

        _getPlayers(players);
        _clearArray();
    }

    let _selectPlayer = function(index) {
        switch (lastPlay) {

            case players[0].id :
                lastPlay = players[1].id;

                if (typeof index === 'number') {
                    setTimeout(function(){_render(players[1].id, index)},400);
                }
                else {_render(players[1].id, this);}
                break;

            case players[1].id :
                lastPlay = players[0].id;

                _render(players[0].id, this);
                break;

            case '' :
                if (firstMove === players[0].id) {
                    lastPlay = players[0].id;
                }
                else {
                    lastPlay = players[1].id;
                }

                if (typeof index === 'number') {
                    setTimeout(function(){_render(firstMove, index)}, 400);
                }
                else {_render(firstMove, this)};

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

            // match horizontal wins
        if (boardMatch.match(/(^((o){3}|(x){3}))|(((o){3}|(x){3})$)|(\S{3}((o){3}|(x){3})\S{3})/) ||

            // match vertical wins
            boardMatch.match(/((o(\S){2}){2}o)|((x(\S){2}){2}x)/) ||

            // match diagonal wins
            boardMatch.match(/((^(o(\S){3}){2}o)|((\S){2}(o(\S){1}){2}o(\S){2}))|((^(x(\S){3}){2}x)|((\S){2}(x(\S){1}){2}x(\S){2}))/)) {
            
            if (lastPlay === players[0].id) {
                pubsub.publish('statusChange', ['win', players[0]]);
                return true;
            } else {
                pubsub.publish('statusChange', ['win', players[1]]);
                return true;
            };

            // match tie
        } else if (!boardMatch.match(/n/)) {
            pubsub.publish('statusChange', ['tie']);
            return true;
        } 
    }

    pubsub.subscribe('newGame', _restart);
    pubsub.subscribe('makeMove', _render);
    pubsub.subscribe('newRound', _clearArray);

    pubsub.subscribe('aiMove', _selectPlayer);

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
    let player1Display = document.querySelector('.player1');
    let player2Display = document.querySelector('.player2');

    let player1Name = document.querySelector('.player1 p');
    let player2Name = document.querySelector('.player2 p');

    let player1Count = document.querySelector('.player1 .count');
    let player2Count = document.querySelector('.player2 .count');

    let player1Symbol = document.querySelector('.symbol1');
    let player2Symbol = document.querySelector('.symbol2');

    let startGamePanel = document.querySelector('.start-container');
    let startGameBtn = document.querySelector('#start-game');

    let changeStatusPanel = document.querySelector('.endgame-container');
    let changeStatusMsg = document.querySelector('.endgame-container p');
    let newRoundBtn = document.querySelector('#new-round');
    let newGameBtn = document.querySelector('#new-game');

    let player1Input = document.querySelector('#name1 input');
    let player2Input = document.querySelector('#name2 input');
    let symbol1Input = document.querySelector('#symbol1 div');
    let symbol2Input = document.querySelector('#symbol2 div');

    let displaySection = document.querySelector('.display');

    let aiBtn = document.querySelector('#name2 button');
    aiBtn.addEventListener('click', () => {
        player2Input.classList.toggle('mono');
        if (player2Input.readOnly) {
            player2Input.readOnly = false;
        } else {
            player2Input.readOnly = true;
        }

        if (player2Input.value === 'AI') {
            player2Input.value = 'Player 2';
            player2Name.textContent = 'Player 2';
        } else {
            player2Input.value = 'AI';
            player2Name.textContent = 'AI';
        }

        aiBtn.classList.toggle('aiSelected');
        player2Name.classList.toggle('mono');
    })

    // allow name input
    player1Input.addEventListener('change', () => {
        player1Name.textContent = player1Input.value;
    });
    player2Input.addEventListener('change', () => {
        player2Name.textContent = player2Input.value;
    });

    // allow symbol choice
    let symbolInputs = [symbol1Input, symbol2Input];
    symbolInputs.forEach( each => {
        each.addEventListener('click', () => {
        if (symbol1Input.textContent === 'x') {
            symbol1Input.textContent = 'o';
            player1Symbol.textContent = 'o';
            symbol2Input.textContent = 'x';
            player2Symbol.textContent = 'x';
        }
        else if (symbol1Input.textContent === 'o') {
            symbol1Input.textContent = 'x';
            player1Symbol.textContent = 'x';
            symbol2Input.textContent = 'o';
            player2Symbol.textContent = 'o';
        }
    })});
    


    let _setPlayer = function() {

        let player1 = Player(player1Name.textContent, player1Symbol.textContent);
        let player2 = Player(player2Name.textContent, player2Symbol.textContent);

        return { player1, player2 };
    }

    let _startGame = function() {

        const { player1, player2 } = _setPlayer();

        pubsub.publish('newGame', [player1, player2]);

        startGamePanel.classList.toggle('hidden');
        displaySection.classList.toggle('hidden');

    }
    startGameBtn.addEventListener('click', _startGame);

    let _newRound = function() {

        changeStatusPanel.classList.toggle('hidden');
        pubsub.publish('newRound');

    }
    newRoundBtn.addEventListener('click', _newRound);

    let _newGame = function() {

        pubsub.publish('playerTurn', 'restart');
        startGamePanel.classList.toggle('hidden');
        changeStatusPanel.classList.toggle('hidden');
        displaySection.classList.toggle('hidden');
        player1Count.textContent = 0
        player2Count.textContent = 0

    }
    newGameBtn.addEventListener('click', _newGame);

    let _statusHandler = function(data) {
        changeStatusPanel.classList.toggle('hidden');

        if (data[0] === 'win') {

            changeStatusMsg.textContent = `${data[1].name} wins this round!!`
            if (data[1].name === player1Name.textContent) {
                player1Count.textContent = +player1Count.textContent + 1;
            } else if (data[1].name === player2Name.textContent) {
                player2Count.textContent = +player2Count.textContent + 1;
            }
        }
        else if (data[0] === 'tie') {
            changeStatusMsg.textContent = "Its's a tie!!"
        }
    }

    let _displayTurn = function(restart) {

        if (restart && displaySection.classList.value === 'display turn1') {
            return;
        }
        displaySection.classList.toggle('turn1');
        displaySection.classList.toggle('turn2');
    }
        
    pubsub.subscribe('statusChange', _statusHandler);
    pubsub.subscribe('playerTurn', _displayTurn);

    return {  }
})();

let gameAI = (function() {

    let _play = function(gameboard) {
        console.log(gameboard)
        let index = Math.floor(Math.random() * 9);
        for (let i = index ; ; ) {

            if (gameboard[i] === null) {
                pubsub.publish('aiMove', i)
                break;
            };

            if (i === 8) {
                i = 0;
            } else {
                i++
            };
        }
    }


    pubsub.subscribe('aiTurn', _play)

})();