//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage,planeImage, enemyImage, gameoverImage;
let gameOver = false; // true 이면 게임 끝남, false 면 계속됨
let score = 0 //점수를 내줌

//비행기 좌표
let planeX = canvas.width-400;
let planeY = canvas.height/2-0 ;

let bulletList = [] //총알들을 저장하는 리스트
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = planeX
        this.y = planeY+14;
        this.alive = true; //true이면 살아있는 총알, false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.x += 4;
    }
    this.checkHit = function(){
        for(let i=0; i < enemyList.length; i++){
        if(
        this.x + 16 >= enemyList[i].x &&
        this.y <= enemyList[i].y +40 &&
        this.y + 16 >= enemyList[i].y)
        {
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i,1); //잘라내기
        }
    }
    };   
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}
let enemyList = []
function Enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y = 0
        this.x = generateRandomValue(0,canvas.width-40)
        enemyList.push(this)
    }
    this.update = function(){
        this.y += 4;

        if(this.y >= canvas.height - 40){
            gameOver = true;
            console.log("gameover");
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/게임배경.jpg";

    planeImage = new Image();
    planeImage.src = "images/초록색전투기.png";

    enemyImage = new Image();
    enemyImage.src = "images/새아이콘.png";

    gameoverImage = new Image();
    gameoverImage.src = "images/게임오버.png";

    bulletImage = new Image();
    bulletImage.src = "images/화살.png";
}
let keysDown = {};
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet()//총알 생성
        }
    });
}

function createBullet(){
    console.log("총알생성!!");
    let b = new Bullet() //총알 하나 생성
    b.init()
    console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}



function update(){
    if (40 in keysDown){
        planeY += 4; //비행기의 속도
    } //아래쪽
    if(38 in keysDown){
        planeY -= 4;
    } //위쪽

    if(planeY <= 0){
        planeY = 0;
    }
    if(planeY >= canvas.height){
        planeY = canvas.height - 48;
    }
    for(let i=0; i< bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
    }
}  
    for(let i=0; i<enemyList.length; i++){
    enemyList[i].update();
 }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(planeImage, planeX, planeY);
    ctx.fillText(`Score:${score}`,20,20)
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";

    for(let i=0; i< bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    } 
}
    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }
} //마구마구 그려주는 함수

function main(){
    if(!gameOver){
    update(); //좌표값을 업데이트
    render(); //그려주고
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main(); 

//방향키를 누르면
//비행기의 xy좌표가 바뀌고
// 다시 render을 그려준다.

//총알만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알 x값이 증가, 총알의 y값은? 스페이스를 누른 순간의 우주선 좌표
//3. 총알들은 x,y좌표값이 있어야 한다.
//4. 총알 배열을 가지고 render을 그려준다.

//적군 만들기
// x,y, init, update
// 적군은 위치가 랜덤이다.
// 적군은 밑으로 내려온다. =y 증가
// 1초마다 하나씩 적군이 나온다.
// 적군이 바닥에 닿으면 게임오버
// 적군과 총알이 만나면 적군이 사라진다. 1점 획득!

//적군이 죽는다.
//총알이 적군에게 닿는다. (총알 x>= 적군의 x
// 총알 y<= 적군 y and 총알.y >= 적군.y+적군의 너비 )
//총알이 죽게됨. 적군이 없어짐