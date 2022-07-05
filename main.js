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
    htmlBoard.forEach(each => {each.addEventListener('click', _selectPlayer)})


    let _render = function() {
        for ( let i = 0 ; i < gameboard.length ; i++ ) {
            htmlBoard[i].textContent = gameboard[i];
        }
    }

    _render();

    let _restart = function() {
        gameboard.forEach((element, index) => {
            gameboard[index] = null;
        });
        _render();
    }

    var _selectPlayer = function() {
        switch (lastPlay) {
            case 'playero' :
                pubsub.publish('playerMove', 'playerx');
                lastPlay = 'playerx';
                break;
            case 'playerx' :
                pubsub.publish('playerMove', 'playero');
                lastPlay = 'playero';
                break;
            case '' :
                pubsub.publish('playerMove', firstMove);
                if (firstMove === 'playerx') {
                    lastPlay = 'playero';
                }
                else {
                    lastPlay = 'playerx';
                }
                break;
        }
    }

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

    return { seeArray, _restart, _checkStatus };
})(); 







// factory player
let Player = function(name, symbol) {

    this.name = name;
    this.id = `player${symbol}`;
    this.score = 0

    let _play = function(index) {
        pubsub.publish('play', index);
    }

    let _changeScore = function() {

    }
    pubsub.subscribe('changeStatus', _changeScore);

    let _resetCount = function() {

    }

}

let display = (function() {

    // cache DOM
    

})();