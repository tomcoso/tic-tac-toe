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

    let gameboard = ['o', null, 'x', 'o', 'x', null, 'x', null, null]; ;
    let seeArray = function() {
        console.log(gameboard);
    };

    let htmlBoard = document.querySelectorAll('.cell');

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



    return { seeArray, _restart };
})();







// factory player
let Player = function(name, symbol) {

    this.name = name;
    this.symbol = symbol;
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