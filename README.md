# tic-tac-toe project from TOP

## [Live demo](https://tomcoso.github.io/tic-tac-toe/)

## Process

1. Planning 

    Since this project's focus is on code organisation, I started by making a diagram (first time ever) of the modules i would use and how they would interact with each other.

    <img src="./assets/images/diagram-initial.png" width="500"/>

    I decided to also implement a pubsub/mediator module, to handle the interaction between all the modules since I think its a valuable skill to have in making large projects clean. So this will be a learning experience in multiple fronts.

2. Basic UI

    I first started coding the modules but I quickly decided to build a rudimentary UI first so I could start isolatig and testing features

    <img src="./assets/images/basic-ui.png" width="400"/> 

3. Gameboard Module

    I started coding in a scattered way, without real isolation or linear progression, which made everything more confusing. Lesson learned!. Decided to focus on making the gameboard work, coding the logic behind wins and ties, and alternating moves between players.

    <img src="./assets/images/gameboard.gif" width="400"/>

4. Display Module

    <!-- code continue button -->
    <!-- code new game button -->
    <!-- code scores on players -->
    <!-- code scores on display after continue button is pressed -->
    <!-- code player name inputs -->
    <!-- code symbol selection -->
    <!-- code new game button so that it takes you to start game and name input panel -->
    <!-- make each player name light up when its the player's turn -->

    <!-- BUG: fix _selectPlayer logic where if selecting on an marked cell you lose the turn -->
    <!-- BUG: broken counter -->