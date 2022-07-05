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
    let seeArray = function() {
        console.log(gameboard);
    };

    // Cache DOM
    let htmlBoard = document.querySelectorAll('.cell');
    


    let _render = function(player, position) {
        console.log('render:',player, position);

        for (let i = 0; i < htmlBoard.length ; i++) {
            if (htmlBoard[i] === position) {
                let index = htmlBoard[i].attributes[1].value
                let symbolIndex = player.length - 1;
                gameboard[index] = player[symbolIndex];
            }
        }

        for ( let i = 0 ; i < gameboard.length ; i++ ) {
            htmlBoard[i].textContent = gameboard[i];
        }
    }

    let _restart = function(player1) {

        console.log('restart', player1)

        gameboard.forEach((element, index) => {
            gameboard[index] = null;
        });

        firstMove = player1.id;

        _render();
    }

    let _selectPlayer = function() {
        console.log('selectPlayer:')
        switch (lastPlay) {
            case 'playero' :
                _render('playerx', this);
                lastPlay = 'playerx';
                break;
            case 'playerx' :
                _render('playero', this);
                lastPlay = 'playero';
                break;
            case '' :
                _render(firstMove, this);
                if (firstMove === 'playerx') {
                    lastPlay = 'playerx';
                }
                else {
                    lastPlay = 'playero';
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

            // match horizontal wins
        if (boardMatch.match(/(^((o){3}|(x){3}))|(((o){3}|(x){3})$)|(\S{3}((o){3}|(x){3})\S{3})/) ||

            // match vertical wins
            boardMatch.match(/((o(\S){2}){2}o)|((x(\S){2}){2}x)/) ||

            // match diagonal wins
            boardMatch.match(/((^(o(\S){3}){2}o)|((\S){2}(o(\S){1}){2}o))|((^(x(\S){3}){2}x)|((\S){2}(x(\S){1}){2}x))/)) {

            pubsub.publish('statusChange', 'win', lastPlay);
        }
    }

    pubsub.subscribe('newGame', _restart);
    pubsub.subscribe('makeMove', _render)

    return { seeArray, _restart, _checkStatus };
})(); 







// factory player
let Player = function(name, symbol) {

    this.name = name;
    this.id = `player${symbol.toLowerCase()}`;
    this.score = 0

    let play = function(player, position) {
        console.log('play', player, position, this.id)
        if (this.id === player) {
            
            pubsub.publish('makeMove', [player, position]);
        }
    }

    // let _changeScore = function() {

    // }
    // pubsub.subscribe('changeStatus', _changeScore);

    // let _resetCount = function() {

    // }

    // pubsub.subscribe('selectMove', play);

    return { id, play };

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

    let _setPlayer = function() {

        let player1 = Player(player1Name, player1Symbol);
        let player2 = Player(player2Name, player2Symbol);

        console.log('setPlayer', player1, player2);

        return { player1, player2 };
    }

    let _startGame = function() {

        const { player1, player2 } = _setPlayer();

        pubsub.publish('newGame', player1);

        startGamePanel.classList.add('hidden');
    }
        
    startGameBtn.addEventListener('click', _startGame);

    return {  }
})();