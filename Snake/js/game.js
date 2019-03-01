var scl = 10;
var app;
var arr = new Array();
var head;
var foodx;
var foody;
var total = 0;
var tailArr= [];
var tailSegment;
var s;
var init = function () {
    var loader = PIXI.loader
        .add('images/bg.png')
        .once('complete', function (loader,resorses) {
            start();
        }).
        load();
    start = function () {
        const canvas = document.getElementById('mycanvas');
        app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight
        });
        app.renderer.autoResize = true;
        app.renderer.resize(window.innerWidth, window.innerHeight);

        creatMatrix();
        S = new SnakeSegment()
        tailArr.push(s)
        var counter = 0;
        app.ticker.add(function (delta) {
        window.addEventListener('keydown', handler);
            counter++
          if(counter>=5){
              S.goTo();
              counter=0;
            }
        });
        placemeal();
    }
}
init();

function creatMatrix () {
    for (var i = 0; i < 40; i++) {
        arr[i] = new Array();
        for (var j = 0; j < 40; j++) {
            const pixes = new PIXI.Graphics();
            pixes.beginFill(0xFFFF00);
            pixes.drawRect(0, 0, scl, scl);
            arr[i][j] = pixes
            arr[i][j].x= i*scl;
            arr[i][j].y= j*scl;
            //app.stage.addChild( arr[i][j]);
        }
    }
}

function TailSegment(){
    this.currentX=0 ;
    this.currentY=0 ;
    this.xspeed = 1;
    this.yspeed = 0;

    this.nextSection=  {x:0,y:0}
    this.perciousSegment = {x:0,y:0}

}
function SnakeSegment(){
    total++;
    this.currentX = 0;
    this.currentY = 0;
    this.xspeed = 1;
    this.yspeed = 0;

   this.nextSection={x:0,y:0}
   this.perciousSegment = {x:0,y:0}

   this.goTo = function(){
       this.perciousSegment.x = this.currentX;
       this.perciousSegment.y = this.currentY;
        this.nextSection.x = this.currentX=this.currentX  + this.xspeed;
       this.nextSection.y = this.currentY=this.currentY  + this.yspeed;
        if(this.nextSection.x == foodx && this.nextSection.y ==foody ){
           removeMeal();
           placemeal();
           tailSegment = new TailSegment();
           tailSegment.currentX = this.currentX;
           tailSegment.currentY = this.currentY;
            tailArr.push(tailSegment);
            total++;
            app.stage.addChild(arr[tailArr[total-1].currentX][tailArr[total-1].currentY])
        }
    app.stage.addChild(arr[this.nextSection.x][this.nextSection.y])
    app.stage.removeChild(arr[this.currentX - this.xspeed][this.currentY-this.yspeed])
   }


    this.dir = function (x,y)
    {
        this.xspeed = x;
        this.yspeed = y;
    }
}

var handler = function (event) {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
    if (event.keyCode == 37) { // LEFT
        S.dir(-1,0);
    }
    else if (event.keyCode == 39) { // RIGHT
        S.dir(1,0);
    } else if (event.keyCode == 38) { // UP
        S.dir(0,-1);
    } else if (event.keyCode == 40) { // DOWN
        S.dir(0,1);
    }
}
function placemeal(){
    food = new PIXI.Graphics();
    food.beginFill(0x7FFF00);
    foodx = randomInt(0, 40) ;
    foody = randomInt(0, 40) ;;
    food.drawRect(arr[foodx][foody].x, arr[foodx][foody].y, scl, scl);
    arr[foodx][foody] = food;
    app.stage.addChild(food);

}

function removeMeal(){
    app.stage.removeChild(arr[foodx][foody]);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}