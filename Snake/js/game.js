const scl = 10;
var app;
var areaArr = new Array();
var total = 0;
var tailArr = [];
var snake;
const gameSize = 40;
var scoreText;
var animal;
var appInit = function () {
    var loader = PIXI.loader
        .add('images/bg.png')
        .once('complete', function (loader, resorses) {
            start();
        }).load();
    start = function () {
        const canvas = document.getElementById('mycanvas');
        app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight
        });
        app.renderer.autoResize = true;
        app.renderer.resize(window.innerWidth, window.innerHeight);
        gameInit();
    }
}

    function gameInit(){
        creatMatrix();
        updateScore(1);
        snake = new SnakeSegment();
        animal = new Animal();
        tailArr.push(snake)
        var gameSpeedIndex = 0;
        window.addEventListener('keydown', handler);
        app.ticker.add(function (delta) {
            gameSpeedIndex++
            if(gameSpeedIndex>=3){
                snake.goTo();
                gameSpeedIndex=0;
            }

        });
        placeAnimal();
}
appInit();
function creatMatrix () {
    for (var i = 0; i < gameSize; i++) {
        areaArr[i] = new Array();
        for (var j = 0; j < gameSize; j++) {

            const backgroudPixes = new PIXI.Graphics();
            backgroudPixes.beginFill(0x0404B4);
            backgroudPixes.drawRect(i*scl, j*scl, scl, scl);
            app.stage.addChild(backgroudPixes);

            const pixes = new PIXI.Graphics();
            pixes.beginFill(0xFFFF00);
            pixes.drawRect(0, 0, scl, scl);
            //areaArr[i][j] = pixes;
            areaArr[i].push(pixes);
            areaArr[i][j].x= i*scl;
            areaArr[i][j].y= j*scl;
        }
    }
}
function Animal(){
    this.animalX=0;
    this.animalY=0;
}
function SnakeSegment() {
    total++;
    this.currentX = 0;
    this.currentY = 0;
    this.xspeed = 1;
    this.yspeed = 0;
    this.nextSection = {x: 0, y: 0};
    this.perciousSegment = {x: 0, y: 0};

    this.goTo = function () {
        this.nextSection.x = this.currentX = this.currentX + this.xspeed;
        this.nextSection.y = this.currentY = this.currentY + this.yspeed;
        if (this.nextSection.y == -1) {
            gameOver();
            return;
        }

        app.stage.addChild(areaArr[this.nextSection.x][this.nextSection.y])
        app.stage.removeChild(areaArr[this.currentX - this.xspeed][this.currentY - this.yspeed])

        this.perciousSegment.x = this.currentX - this.xspeed;
        this.perciousSegment.y = this.currentY - this.yspeed;
        if (this.nextSection.x == animal.animalX && this.nextSection.y == animal.animalY) {
            removeAnimal();
            placeAnimal();
            var tailSegment = new SnakeSegment();
            tailArr.push(tailSegment);
            if (total == 1) {
                updateScore(total);
                tailSegment.currentX = this.perciousSegment.x;
                tailSegment.currentY = this.perciousSegment.y;
            } else if (total > 1) {
                updateScore(total);
                tailArr[tailArr.length - 1].currentX = tailArr[tailArr.length - 2].currentX;
                tailArr[tailArr.length - 1].currentY = tailArr[tailArr.length - 2].currentY;
            }
        }
        if (total > 1) {
            tailArr[1].currentX = this.perciousSegment.x;
            tailArr[1].currentY = this.perciousSegment.y;
            updatSnakeSegments();
        }

        if (boarderColision(this.nextSection.x, this.nextSection.y)) {
            gameOver();
        }
        if (selfColision(this.nextSection.x, this.nextSection.y)) {
            gameOver();
        }
        this.dir = function (x, y) {
            if (!this.xspeed == Math.abs(x)) {
                this.xspeed = x;
            }
            if (!this.yspeed == Math.abs(y)) {
                this.yspeed = y;
            }
        }

    }

    function boarderColision(x, y) {
        if (x == areaArr.length - 1 || x == 0 || y == -1 || y == areaArr.length - 1) {
            return true;
        }
    }

    function selfColision(x, y) {
        var nextSehmentX = x;
        var nextSegmentY = y;

        for (let i = 1; i < tailArr.length; i++) {
            if ((nextSehmentX == tailArr[i].currentX) && (nextSegmentY == tailArr[i].currentY)) {
                return true;
            }
        }
    }

    function updatSnakeSegments() {
        for (let i = 1; i < tailArr.length; i++) {
            var segmentX;
            var segmentY
            var segmentPerviousX;
            var segmentPerviousY;
            if (i >1) {
                tailArr[i].currentX = tailArr[i - 1].perviousSegmenX;
                tailArr[i].currentY = tailArr[i - 1].perviousSegmentY;
            }
                segmentX = tailArr[i].currentX;
                segmentY = tailArr[i].currentY;
                segmentPerviousX = tailArr[i].perviousX;
                segmentPerviousY = tailArr[i].perviousY;
                app.stage.addChild(areaArr[segmentX][segmentY]);
                tailArr[i].perviousSegmenX = segmentPerviousX;
                tailArr[i].perviousSegmentY = segmentPerviousY;
                tailArr[i].perviousX = tailArr[i].currentX;
                tailArr[i].perviousY = tailArr[i].currentY;
                if (segmentPerviousX > 0 && segmentPerviousY > 0) {
                    app.stage.removeChild(areaArr[segmentPerviousX][segmentPerviousY]);
                }
        }
    }
}

    var handler = function (event) {
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
        if (event.keyCode == 37) { // LEFT
            snake.dir(-1, 0);
        }
        else if (event.keyCode == 39) { // RIGHT
            snake.dir(1, 0);
        } else if (event.keyCode == 38) { // UP
            snake.dir(0, -1);
        } else if (event.keyCode == 40) { // DOWN
            snake.dir(0, 1);
        }
    }

    function placeAnimal() {
        var food = new PIXI.Graphics();
        food.beginFill(0xFFFF00);
        animal.animalX = randomInt(5, 35);
        animal.animalY = randomInt(5, 35);
        food.drawRect(areaArr[animal.animalX][animal.animalY].x, areaArr[animal.animalX][animal.animalY].y, scl, scl);
        app.stage.addChild(areaArr[ animal.animalX][animal.animalY]);
   }

    function removeAnimal() {
        app.stage.removeChild(areaArr[animal.animalX][animal.animalY]);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateScore(scoreVal) {
        if (total == 0) {
            scoreText = new PIXI.Text("", {
                fontFamily: 'Arial',
                fontSize: 15,
                fill: '#ffffff'
            });
            scoreText.text = 'Score:  ' + 0;
            scoreText.x = 300;
            scoreText.y = 10;
            scoreText.setText('Score: ' + scoreVal);
            app.stage.addChild(scoreText);
        }
        else {
            scoreText.setText('Score: ' + scoreVal);
        }
    }
    function gameOver() {
        var infoText = new PIXI.Text('Game Over', {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: '#ffffff'
        });
        infoText.x = 120;
        infoText.y = 120;
        app.stage.addChild(infoText);
        app.ticker.stop();
    }


