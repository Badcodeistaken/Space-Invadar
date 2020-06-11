window.addEventListener("keydown",getKey,false);
window.addEventListener("mousedown",shoot);
var canvas;
var gl;
var program;

var vPosition;
var vColor;
var vBuffer;
var vColorBuffer;
var Red = vec4(1.0, 0.0, 0.0, 1.0);
var Green = vec4(0.0,1.0,0.0,1.0);
var dy=0.001;
var dx=0.001;
var shootingseepd = 0.01;
var GameLose = false;
var count = 0;
var rate = 700;
// Three Vertices        
var TargetRow1 = [
    vec2( -0.95, 0.95 ), vec2( -0.95, 0.75 ), vec2( -0.85, 0.95 ), 
    vec2( -0.95, 0.75 ), vec2( -0.85, 0.75 ), vec2( -0.85, 0.95 ),

    vec2( 0.85, 0.95 ), vec2( 0.85, 0.75 ), vec2( 0.95, 0.95 ), 
    vec2( 0.85, 0.75 ), vec2( 0.95, 0.75 ), vec2( 0.95, 0.95 ),

    vec2( 0.35, 0.95 ), vec2( 0.35, 0.75 ), vec2( 0.45, 0.95 ), 
    vec2( 0.35, 0.75 ), vec2( 0.45, 0.75 ), vec2( 0.45, 0.95 ),

    vec2( -0.55, 0.95 ), vec2( -0.55, 0.75 ), vec2( -0.45, 0.95 ), 
    vec2( -0.55, 0.75 ), vec2( -0.45, 0.75 ), vec2( -0.45, 0.95 )
];

var TargetRow2=[
    vec2( -0.95, 0.95-0.25 ), vec2( -0.95, 0.75-0.25 ), vec2( -0.85, 0.95-0.25 ), 
    vec2( -0.95, 0.75-0.25 ), vec2( -0.85, 0.75-0.25 ), vec2( -0.85, 0.95-0.25 ),

    vec2( 0.85, 0.95-0.25 ), vec2( 0.85, 0.75-0.25 ), vec2( 0.95, 0.95-0.25 ), 
    vec2( 0.85, 0.75-0.25 ), vec2( 0.95, 0.75-0.25 ), vec2( 0.95, 0.95-0.25 ),

    vec2( 0.35, 0.95-0.25 ), vec2( 0.35, 0.75-0.25 ), vec2( 0.45, 0.95-0.25 ), 
    vec2( 0.35, 0.75-0.25 ), vec2( 0.45, 0.75-0.25 ), vec2( 0.45, 0.95-0.25 ),

    vec2( -0.55, 0.95-0.25 ), vec2( -0.55, 0.75-0.25 ), vec2( -0.45, 0.95-0.25 ), 
    vec2( -0.55, 0.75-0.25 ), vec2( -0.45, 0.75-0.25 ), vec2( -0.45, 0.95-0.25 )   
];

var TargetColor=[
    Red, Red, Red, Red, Red, Red,
    Red, Red, Red, Red, Red, Red,
    Red, Red, Red, Red, Red, Red,
    Red, Red, Red, Red, Red, Red
];

var Cannon=[
    vec2(0.0, -0.8), vec2(0.0, -1.0), vec2(0.1, -0.8),
    vec2(0.0, -1.0), vec2(0.1, -1.0), vec2(0.1, -0.8)
];


//Green color
var CannonColor=[
    vec4(0.0,1.0,0.0,1.0), vec4(0.0,1.0,0.0,1.0), vec4(0.0,1.0,0.0,1.0), 
    vec4(0.0,1.0,0.0,1.0), vec4(0.0,1.0,0.0,1.0), vec4(0.0,1.0,0.0,1.0)
];

var CannonBulletsColor=[   
];

var CannonBullets=[
];

var TargetBullets=[
];

var TargetBulletsColor=[
]

var dir = [0,0,0,0,0,0,0,0];


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    vBuffer = gl.createBuffer();
    vColorBuffer = gl.createBuffer();
       
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation(program, "vColor"); 
    changeDir();  
    render();
};

function changeDir(){
    setTimeout(function(){
        for(var i = 0; i<dir.length; i++){
            if(Math.random()>0.5){
                dir[i]=1;
            }else{
                dir[i]=-1;
            }
        }
        changeDir();
    }, rate)
}

function updateTargetRow1(){
    for(i =0; i<TargetRow1.length/6; i++){
        for(j =0; j<6; j++){
            if(TargetRow1[6*i+j][0] >= 1){
                dir[i] = -1;
            }
            else if(TargetRow1[6*i+j][0] <= -1){
                dir[i] = 1;
            }
            TargetRow1[6*i+j]=vec2(TargetRow1[6*i+j][0]+dir[i]*dx, TargetRow1[6*i+j][1]-dy);
            if(TargetRow1[6*i+j][1] <= -1){
                GameLose = true;
            }
        }
    }
}

function updateTargetRow2(){
    for(i =0; i<TargetRow2.length/6; i++){
        for(j =0; j<6; j++){
            if(TargetRow2[6*i+j][0] >= 1){
                dir[i+4] = -1;
            }
            else if(TargetRow2[6*i+j][0] <= -1){
                dir[i+4] = 1;
            }
            TargetRow2[6*i+j]=vec2(TargetRow2[6*i+j][0]+dir[i+4]*dx, TargetRow2[6*i+j][1]-dy);
            if(TargetRow2[6*i+j][1] <= -1){
                GameLose = true;
            }
        }
    } 
}

var pressed = 0;
function getKey(key){
    if(key.key == "ArrowLeft")
        pressed = 1;
    else if(key.key == "ArrowRight")
        pressed = 2;
    else if(key.key == "r")
        pressed = 3;
    else if(key.key == "q")
        pressed = 4;
}

function updateCannon(){
    if(pressed == 1){
        for(var i = 0; i < Cannon.length; i++){
            Cannon[i] = vec2(Cannon[i][0] - 0.1, Cannon[i][1]);
        }
    }
    else if(pressed == 2)
        for(var i = 0; i < Cannon.length; i++){
            Cannon[i] = vec2(Cannon[i][0] + 0.1, Cannon[i][1]);
        }
    pressed = 0;
}

function shoot(){   
    CannonBullets.push(vec2(Cannon[0][0] + 0.03, Cannon[0][1]));
    CannonBullets.push(vec2(Cannon[2][0] - 0.03, Cannon[2][1]));
    CannonBullets.push(vec2(Cannon[0][0] + 0.05, Cannon[0][1] + 0.08));
    for(var i = 0; i < 3; i++){
        CannonBulletsColor.push(Green);
    }
}

function updateBullets(){
    for(var i = 0; i < CannonBullets.length/3; i++){
        for(var j = 0; j < 3; j++){
            CannonBullets[3*i+j] = vec2(CannonBullets[3*i+j][0], CannonBullets[3*i+j][1]+shootingseepd);
        }
        if(CannonBullets[i*3][1] >= 0.92){
                CannonBullets.splice(i*3,3);
            }
    }
}

function attack(){
    if(TargetRow2.length == 0){
        TargetAtt(TargetRow1);
    }
    else{
        TargetAtt(TargetRow2);
    }
}

function TargetAtt(TargetArr){
    for (var i = 0; i < TargetArr.length/6; i++) {
        TargetBullets.push(vec2(TargetArr[i*6+1][0] + 0.03, TargetArr[i*6+1][1]));
        TargetBullets.push(vec2(TargetArr[i*6+4][0] - 0.03, TargetArr[i*6+4][1]));
        TargetBullets.push(vec2(TargetArr[i*6+1][0] + 0.05, TargetArr[i*6+1][1] - 0.08));
    }
    for(var i = 0; i < TargetArr.length/6; i++){
        for(var j = 0; j < 3; j++){
            TargetBulletsColor.push(Red);
        }
    }
}

function updateAttack(){
    for(var i = 0; i < TargetBullets.length/3; i++){
        for(var j = 0; j < 3; j++){
            TargetBullets[3*i+j] = vec2(TargetBullets[3*i+j][0], TargetBullets[3*i+j][1]-shootingseepd);
        }
        if(TargetBullets[i*3][1] <= -0.92){
                TargetBullets.splice(i*3,3);
            }
    }
}

function IsRestart(){
    if(pressed == 3){
        location.reload();
    }
}

function IsQuit(){
    if(pressed == 4){
        var result = window.confirm("Do you really want to leave?");
        if(result == true){
            window.close();
        }
    }
}

function IsGameOver(){
    if((TargetRow1.length == 0)&&(TargetRow2.length == 0)){
        var result = window.confirm("You win! Congrats!!! Do you want to play again?");
        if(result == true){
            location.reload();
        }
        else{
            window.close();
        }
    }
    else if(GameLose == true){
        var result = window.confirm("You lose! GG:) Do you want to try again?");
        if(result == true){
            location.reload();
        }
        else{
            window.close();
        }
    }
}

function IsShot(){
    for(var i = 0; i < TargetBullets.length/3; i++){
        if((TargetBullets[i+2][0] >= Cannon[0][0])&&(TargetBullets[i+2][0] <= Cannon[2][0])&&(TargetBullets[i+2][1] <= -0.8)){
                GameLose = true;
        }
    }

    if(CannonBullets.length!=0){
        for(var i = 0; i < CannonBullets.length/3; i++){
            if(TargetRow2.length != 0){
                for(var j = 0; j < TargetRow2.length/6; j++){
                    if((CannonBullets[i*3+2][1] >= (TargetRow2[j*6][1]-0.2))&&(CannonBullets[i*3+2][0] >= TargetRow2[j*6+1][0])&&(CannonBullets[i+2][0] <= TargetRow2[j*6+4][0])&&(CannonBullets[i*3+2][1] <= TargetRow2[j*6][1])){
                        TargetRow2.splice(j*6,6);
                    }
                }
            }

            if(TargetRow1.length != 0){
                for(var j = 0; j < TargetRow1.length/6; j++){
                    if((CannonBullets[i*3+2][1] >= (TargetRow1[j*6][1]-0.2))&&(CannonBullets[i*3+2][0] >= TargetRow1[j*6+1][0])&&(CannonBullets[i+2][0] <= TargetRow1[j*6+4][0]) && (CannonBullets[i*3+2][1] <= TargetRow1[j*6][1])){
                        TargetRow1.splice(j*6,6);
                    }
                }
            }
        }
    }
}



function render() {
    count++;
    IsRestart();
    IsQuit();
    IsShot();
    IsGameOver();

    updateTargetRow1();
    updateTargetRow2();
    updateCannon();
    updateBullets();
    if(count%100 == 0){
        attack();
        rate = rate - 50;
    }
    updateAttack();

    gl.clear( gl.COLOR_BUFFER_BIT ); 
    
    //Draw Target
    Draw(TargetRow1,TargetColor);
    Draw(TargetRow2,TargetColor);
    Draw(Cannon, CannonColor);
    Draw(CannonBullets,CannonBulletsColor);
    Draw(TargetBullets,TargetBulletsColor);
    window.requestAnimFrame(render);
}

function Draw(VerArr, ColArr){
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(VerArr), gl.STATIC_DRAW);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, vColorBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ColArr), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vColor); 
    
    gl.drawArrays( gl.TRIANGLES, 0, VerArr.length);
}

