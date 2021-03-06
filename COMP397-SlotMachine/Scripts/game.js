/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "Apple", src: "assets/images/apple.png" },
    { id: "Pear", src: "assets/images/pear.png" },
    { id: "Horseshoe", src: "assets/images/horseshoe.png" },
    { id: "Grape", src: "assets/images/grape.png" },
    { id: "Bar", src: "assets/images/bar.png" },
    { id: "Bell", src: "assets/images/bell.png" },
    { id: "Clover", src: "assets/images/clover.png" },
    { id: "Diamond", src: "assets/images/diamond.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];
var atlas = {
    "images": ["assets/images/atlas.png"],
    "frames": [
        [2, 2, 64, 64],
        [2, 68, 64, 64],
        [2, 134, 64, 64],
        [200, 2, 49, 49],
        [200, 53, 49, 49],
        [200, 104, 49, 49],
        [68, 2, 64, 64],
        [134, 2, 64, 64],
        [68, 68, 64, 64],
        [134, 68, 64, 64],
        [134, 134, 49, 49],
        [68, 134, 64, 64],
        [185, 155, 49, 49]
    ],
    "animations": {
        "bananaSymbol": [0],
        "barSymbol": [1],
        "bellSymbol": [2],
        "betMaxButton": [3],
        "betOneButton": [4],
        "betTenButton": [5],
        "blankSymbol": [6],
        "cherrySymbol": [7],
        "grapesSymbol": [8],
        "orangeSymbol": [9],
        "resetButton": [10],
        "sevenSymbol": [11],
        "spinButton": [12]
    }
};
// Game Variables
var background;
var apple;
var pear;
var bar;
var bell;
var clover;
var diamond;
var grape;
var horseshoe;
var reel1;
var reel2;
var reel3;
var textureAtlas;
var spinButton;
var resetButton;
var betOneButton;
var betTenButton;
var betMaxButton;
//var betLabel: objects.Label;
var betLabel;
var playercreditLabel;
var spinresult;
/* Tally Variables */
var apples = 0;
var pears = 0;
var clovers = 0;
var bars = 0;
var bells = 0;
var grapes = 0;
var horseshoes = 0;
var diamonds = 0;
var spinResult;
var fruits = "";
var playercredit = 5000;
var bet1 = 1;
var bet10 = 10;
var bet = 0;
var betmax = 0;
var temp;
var winrate = 0;
var jackpot = 5000;
var loss = 0;
// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
    // Load Texture Atlas
    textureAtlas = new createjs.SpriteSheet(atlas);
    //Setup statistics object
    setupStats();
}
// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop);
    // calling main game function
    main();
}
// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps
    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);
}
// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring
    stage.update();
    stats.end(); // end measuring
}
/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}
/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];
    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "Horseshoe";
                horseshoes++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "Grape";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "Apple";
                apples++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "Pear";
                pears++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "Diamond";
                diamonds++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "Bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "Bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "Clover";
                clovers++;
                break;
        }
    }
    return betLine;
}
function WinRate() {
    if (horseshoes == 0) {
        if (grapes == 3) {
            winrate = bet * 10;
        }
        else if (apples == 3) {
            winrate = bet * 20;
        }
        else if (pears == 3) {
            winrate = bet * 30;
        }
        else if (diamonds == 3) {
            winrate = bet * 40;
        }
        else if (bars == 3) {
            winrate = bet * 50;
        }
        else if (bells == 3) {
            winrate = bet * 75;
        }
        else if (clovers == 3) {
            winrate = bet * 100;
        }
        else if (grapes == 2) {
            winrate = bet * 2;
        }
        else if (apples == 2) {
            winrate = bet * 2;
        }
        else if (pears == 2) {
            winrate = bet * 3;
        }
        else if (diamonds == 2) {
            winrate = bet * 4;
        }
        else if (bars == 2) {
            winrate = bet * 5;
        }
        else if (bells == 2) {
            winrate = bet * 10;
        }
        else if (clovers == 2) {
            winrate = bet * 20;
        }
        else if (clovers == 1) {
            winrate = bet * 5;
        }
        else {
            winrate = bet * 1;
        }
        winrate++;
        showWinMessage();
    }
    else {
        loss++;
        showLossMessage();
    }
}
// Callback function that allows me to respond to button click events
//spinButton function
function spinButtonClicked(event) {
    createjs.Sound.play("clicked");
    if (bet <= playercredit) {
        playercredit = playercredit - bet;
        temp = playercredit;
        spinResult = Reels();
        switch (spinResult[0]) {
            case "Apple":
                reel1 = new createjs.Bitmap(assets.getResult("Apple"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Grape":
                reel1 = new createjs.Bitmap(assets.getResult("Grape"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Horseshoe":
                reel1 = new createjs.Bitmap(assets.getResult("Horseshoe"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Clover":
                reel1 = new createjs.Bitmap(assets.getResult("Clover"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bar":
                reel1 = new createjs.Bitmap(assets.getResult("Bar"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Diamond":
                reel1 = new createjs.Bitmap(assets.getResult("Diamond"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bell":
                reel1 = new createjs.Bitmap(assets.getResult("Bell"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Pear":
                reel1 = new createjs.Bitmap(assets.getResult("Pear"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
        }
        switch (spinResult[1]) {
            case "Apple":
                reel2 = new createjs.Bitmap(assets.getResult("Apple"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Grape":
                reel2 = new createjs.Bitmap(assets.getResult("Grape"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Horseshoe":
                reel2 = new createjs.Bitmap(assets.getResult("Horseshoe"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Clover":
                reel2 = new createjs.Bitmap(assets.getResult("Clover"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Bar":
                reel2 = new createjs.Bitmap(assets.getResult("Bar"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Diamond":
                reel2 = new createjs.Bitmap(assets.getResult("Diamond"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Bell":
                reel2 = new createjs.Bitmap(assets.getResult("Bell"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "Pear":
                reel2 = new createjs.Bitmap(assets.getResult("Pear"));
                reel2.x = 129;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
        }
        switch (spinResult[2]) {
            case "Apple":
                reel3 = new createjs.Bitmap(assets.getResult("Apple"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Grape":
                reel3 = new createjs.Bitmap(assets.getResult("Grape"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Horseshoe":
                reel3 = new createjs.Bitmap(assets.getResult("Horseshoe"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Clover":
                reel3 = new createjs.Bitmap(assets.getResult("Clover"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Bar":
                reel3 = new createjs.Bitmap(assets.getResult("Bar"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Diamond":
                reel3 = new createjs.Bitmap(assets.getResult("Diamond"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Bell":
                reel3 = new createjs.Bitmap(assets.getResult("Bell"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
            case "Pear":
                reel3 = new createjs.Bitmap(assets.getResult("Pear"));
                reel3.x = 204;
                reel3.y = 180;
                stage.addChild(reel3);
                break;
        }
    }
    WinRate();
    //showLossMessage();
    //showWinMessage();
}
//resetButton function
function resetButtonClicked(event) {
    stage.removeChild(reel1);
    stage.removeChild(reel2);
    stage.removeChild(reel3);
    stage.removeChild(betLabel);
    stage.removeChild(spinresult);
    stage.removeChild(playercreditLabel);
    playercredit = 5000;
    playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
    playercreditLabel.x = 36;
    playercreditLabel.y = 303;
    stage.addChild(playercreditLabel);
}
//reset Fruit var
function resetFruitTally() {
    grapes = 0;
    pears = 0;
    clovers = 0;
    diamonds = 0;
    bars = 0;
    bells = 0;
    apples = 0;
    horseshoes = 0;
}
function resetAll() {
    playercredit = 5000;
    winrate = 0;
    jackpot = 5000;
    betmax = bet1 = bet10 = 0;
    loss = 0;
}
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playercredit += jackpot;
        jackpot = 5000;
    }
}
//maxButton
function betmaxButtonClicked(event) {
    if (playercredit > 0) {
        betmax = playercredit;
        playercredit = 0;
        stage.removeChild(playercreditLabel);
        playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
        playercreditLabel.x = 36;
        playercreditLabel.y = 303;
        stage.addChild(playercreditLabel);
        stage.removeChild(betLabel);
        betLabel = new createjs.Text("" + betmax, "20px Consolas", "#000000");
        betLabel.x = 135;
        betLabel.y = 303;
        stage.addChild(betLabel);
    }
    else {
        alert("You dont have sufficient credit");
    }
}
//bet ten Button
function bettenButtonClicked(event) {
    if (playercredit >= 10) {
        playercredit -= 10;
        bet10 = 10;
        stage.removeChild(playercreditLabel);
        playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
        playercreditLabel.x = 36;
        playercreditLabel.y = 303;
        stage.addChild(playercreditLabel);
        var a = bet10.toString();
        stage.removeChild(betLabel);
        betLabel = new createjs.Text(a, "20px Consolas", "#000000");
        betLabel.x = 155;
        betLabel.y = 303;
        stage.addChild(betLabel);
    }
    else {
        alert("You dont have sufficient credit");
    }
}
//bet one Button
function betoneButtonClicked(event) {
    if (playercredit >= 1) {
        playercredit -= 1;
        bet1 = 1;
        stage.removeChild(playercreditLabel);
        playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
        playercreditLabel.x = 36;
        playercreditLabel.y = 303;
        stage.addChild(playercreditLabel);
        var b = bet1.toString();
        stage.removeChild(betLabel);
        betLabel = new createjs.Text(b, "20px Consolas", "#000000");
        betLabel.x = 155;
        betLabel.y = 303;
        stage.addChild(betLabel);
    }
    else {
        alert("You dont have sufficient credit");
    }
}
//WinMessage
function showWinMessage() {
    stage.removeChild(spinresult);
    stage.removeChild(playercreditLabel);
    playercredit += winrate;
    playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
    playercreditLabel.x = 36;
    playercreditLabel.y = 303;
    stage.addChild(playercreditLabel);
    spinresult = new objects.Label("" + winrate, 247, 303, false);
    stage.addChild(spinresult);
    resetFruitTally();
    checkJackPot();
}
//Loss Message
function showLossMessage() {
    stage.removeChild(spinresult);
    stage.removeChild(playercreditLabel);
    playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
    playercreditLabel.x = 36;
    playercreditLabel.y = 303;
    stage.addChild(playercreditLabel);
    spinresult = new objects.Label("Loss", 247, 303, false);
    stage.addChild(spinresult);
    resetFruitTally();
    checkJackPot();
}
// Our Main Game Function
function main() {
    // add in slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
    //add player credit
    stage.removeChild(playercreditLabel);
    playercreditLabel = new createjs.Text("" + playercredit, "20px Consolas", "#000000");
    playercreditLabel.x = 36;
    playercreditLabel.y = 303;
    stage.addChild(playercreditLabel);
    // add spinButton sprite
    spinButton = new objects.Button("spinButton", 250, 334, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);
    // add resetbutton sprite
    resetButton = new objects.Button("resetButton", 16, 334, false);
    stage.addChild(resetButton);
    resetButton.on("click", resetButtonClicked, this);
    // add betonebutton sprite
    betOneButton = new objects.Button("betOneButton", 75, 334, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", betoneButtonClicked, this);
    // add bettenbutton sprite
    betTenButton = new objects.Button("betTenButton", 135, 334, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", bettenButtonClicked, this);
    // add betmaxbutton sprite
    betMaxButton = new objects.Button("betMaxButton", 196, 334, false);
    stage.addChild(betMaxButton);
    betMaxButton.on("click", betmaxButtonClicked, this);
}
//# sourceMappingURL=game.js.map