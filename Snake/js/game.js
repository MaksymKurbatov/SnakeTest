var scl = 10;
var app;
var areaArr = new Array();
var foodx;
var foody;
var total = 0;
var tailArr = [];
var snake;
var scoreText;
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
        creatBakcgroundArea();
        creatMatrix();
        snake = new SnakeSegment()
        tailArr.push(snake)
        var gameSpeedIndex = 0;
        setScoreText();
        app.ticker.add(function (delta) {
            window.addEventListener('keydown', handler);
            gameSpeedIndex++
            if(gameSpeedIndex>=2){
                snake.goTo();
                gameSpeedIndex=0;
            }

        });
        placemeal();

}
appInit();
function creatBakcgroundArea () {
    var arr2=[];
    for (var i = 0; i < 40; i++) {
        arr2[i] = new Array();
        for (var j = 0; j < 40; j++) {
            const pixes = new PIXI.Graphics();
            pixes.beginFill(0x0404B4);
            pixes.drawRect(0, 0, scl, scl);
            arr2[i][j] = pixes
            arr2[i][j].x= i*scl;
            arr2[i][j].y= j*scl;
            app.stage.addChild( arr2[i][j]);
        }
    }
}
function creatMatrix () {
    for (var i = 0; i < 40; i++) {
        areaArr[i] = new Array();
        for (var j = 0; j < 40; j++) {
            const pixes = new PIXI.Graphics();
            pixes.beginFill(0xFFFF00);
            pixes.drawRect(0, 0, scl, scl);
            areaArr[i][j] = pixes
            areaArr[i][j].x= i*scl;
            areaArr[i][j].y= j*scl;
        }
    }
}

function TailSegment(){
    this.currentX=0 ;
    this.currentY=0 ;
    this.perviousX=0 ;
    this.perviousY=0 ;

    this.perviousSegmenX=0 ;
    this.perviousSegmentY=0 ;
}
function SnakeSegment(){
    total++;
    this.currentX = 0;
    this.currentY = 0;
    this.xspeed = 1;
    this.yspeed = 0;

    this.nextSection={x:0,y:0}
    this.perciousSegment = {x:0,y:0}

    this.goTo = function() {
        this.nextSection.x = this.currentX = this.currentX + this.xspeed;
        this.nextSection.y = this.currentY = this.currentY + this.yspeed;
        if (this.nextSection.y == -1 ) {
            gameOverText();
            app.ticker.stop()
            return;
        }
        app.stage.addChild(areaArr[this.nextSection.x][this.nextSection.y])
        app.stage.removeChild(areaArr[this.currentX - this.xspeed][this.currentY - this.yspeed])

        this.perciousSegment.x = this.currentX - this.xspeed;
        this.perciousSegment.y = this.currentY - this.yspeed;
        if (this.nextSection.x == foodx && this.nextSection.y == foody) {
            removeMeal();
            placemeal();
            var tailSegment = new TailSegment();
            tailArr.push(tailSegment);
            if (total == 1) {
                scoreText.setText('Score: ' + total);
                tailSegment.currentX = this.perciousSegment.x;
                tailSegment.currentY = this.perciousSegment.y;
            } else if (total > 1) {
                scoreText.setText('Score: ' + total);
                tailArr[tailArr.length - 1].currentX = tailArr[tailArr.length - 2].currentX;
                tailArr[tailArr.length - 1].currentY = tailArr[tailArr.length - 2].currentY;
            }
            total++;
        }
        if (total > 1) {
            tailArr[1].currentX = this.perciousSegment.x;
            tailArr[1].currentY = this.perciousSegment.y;
            uppdateTale();
        }

        if (boarderColision(this.nextSection.x, this.nextSection.y)) {
            gameOverText();
            app.ticker.stop();

        }
        if (selfColision(this.nextSection.x,this.nextSection.y)){
            gameOverText();
            app.ticker.stop();
        }
        function gameOverText(){
            var infoText = new PIXI.Text('Game Over', {
                fontFamily: 'Arial',
                fontSize: 30,
                fill: '#ffffff'
            });
            infoText.x = 120;
            infoText.y = 120;
            app.stage.addChild(infoText);
        }
    }

    this.dir = function (x,y)
    {
        let newVal = -57.64;
        Math.abs(newVal);
        if (! this.xspeed  == Math.abs(x)){
            this.xspeed = x;
        }
        if (! this.yspeed  == Math.abs(y)){
            this.yspeed = y;
        }
    }

}
function boarderColision(x,y){
    if(x==39||x==0||y==-1||y==39){
        return true;
    }
}
function selfColision(x,y){
    var nextSehmentX= x;
    var nextSegmentY= y;

    for(let i=1; i<tailArr.length; i++ ){
        if ((nextSehmentX == tailArr[i].currentX )&& (nextSegmentY == tailArr[i].currentY)){
            return true;
        }
    }
}
function uppdateTale(){
    for(let i=1; i<tailArr.length; i++ ){
        var segmentX;
        var segmentY
        var segmentPerviousX;
        var segmentPerviousY;
        if(i<2){
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
        if(i>=2){

            tailArr[i].currentX = tailArr[i-1].perviousSegmenX;
            tailArr[i].currentY = tailArr[i-1].perviousSegmentY;
            segmentX = tailArr[i].currentX
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
        snake.dir(-1,0);
    }
    else if (event.keyCode == 39) { // RIGHT
        snake.dir(1,0);
    } else if (event.keyCode == 38) { // UP
        snake.dir(0,-1);
    } else if (event.keyCode == 40) { // DOWN
        snake.dir(0,1);
    }
}
function placemeal(){
   var  food = new PIXI.Graphics();
    food.beginFill(0xFFFF00);
    foodx = randomInt(5, 35) ;
    foody = randomInt(5, 35) ;
    food.drawRect(areaArr[foodx][foody].x, areaArr[foodx][foody].y, scl, scl);
    areaArr[foodx][foody] = food;
    app.stage.addChild(food);

}

function setScoreText(){
    scoreText = new PIXI.Text("", {
        fontFamily: 'Arial',
        fontSize: 15,
        fill: '#ffffff'
    });
    scoreText.text = 'Score:  '+ 0;
    scoreText.x = 300;
    scoreText.y = 10;
    app.stage.addChild(scoreText);

}

function removeMeal(){
    app.stage.removeChild(areaArr[foodx][foody]);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}