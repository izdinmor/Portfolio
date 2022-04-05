var widthMult=2/3;
var heightMult=1/2;
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext("2d");
var width=screen.width*widthMult;
var height=screen.height*heightMult;
canvas.width=width;
canvas.height=height;
var pieceCode=document.getElementsByTagName("p");
var skipButton=document.getElementById("skipbutton");
skipButton.addEventListener("click",accessSite);
var imgCodePiece=document.createElement("img");

//sfx
let jumpSFX=new Audio("https://ia803405.us.archive.org/21/items/jump_20210424/jump.mp3");
let gameoverSFX=new Audio("https://ia903407.us.archive.org/20/items/smb_gameover/smb_gameover.mp3")
let codeSFX=new Audio("https://ia803403.us.archive.org/0/items/classiccoin/classiccoin.mp3")
var retryCard=document.getElementById("retryCard");
var codeCompleteCard=document.getElementById("codeCompleteCard");
let gameStarted=false;
//used for setInterval
let presetTime=1000;
//speed up block 
let ennemySpeed=5;
let codePieceSpeed=4;
let gameOver=false;
//nb of code pieces the player has to get
let nbAllPieces;
let player;
let arrayBlocks;
let codePiece;
let restart;
function startGame(restart){
    if (restart){
        player=new Player(150,(height*3/4-50),50,"blue",player.nbCodePieces);
    }
    else{
        player=new Player(150,(height*3/4-50),50,"blue",0);
    }    
    arrayBlocks=[];
    ennemySpeed=5;  
    presetTime=1000;
    codePiece=null;
    nbAllPieces=5;
    restart=false;
}

function restartGame(button) {
    retryCard.style.display = "none";
    restart=true;    
    button.blur();
    startGame(restart);
    requestAnimationFrame(animate);
}
function accessSite(){
    
    window.location.href="./aboutme.html";
    
}



function drawBackgroundLine(){
    
    ctx.beginPath();
    ctx.moveTo(0,height*3/4);
    ctx.lineTo(width,height*3/4);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle ="black";
    ctx.stroke();    
}

function getRandomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function randomNumberInterval(timeInterval){
    let returnTime=timeInterval;
    if(Math.random()<0.5){
        returnTime+=getRandomNumber(presetTime/3,presetTime*1.5);
    }
    else{
        returnTime-=getRandomNumber(presetTime/5,presetTime/2);
    }
    return returnTime;
}

class Player{
    constructor(x,y,size,color,nbCodePieces){
        this.x=x;
        this.y=y;
        this.width=size;
        this.height=size;
        this.color=color;
        this.jumpheight=12;
        //jump configuration
        this.jumpcounter=0;
        this.isjumping=false;
        //spin configuration
        this.spin=0;
        this.spinIncrement=90/32;
        this.nbCodePieces=nbCodePieces;
        this.allPiecesCollected=false;
        this.iscrouching=false;
        

    }
    rotation(){
        let offsetXPosition=this.x+(this.width/2);
        let offsetYPosition=this.y+(this.height/2);
        ctx.translate(offsetXPosition,offsetYPosition);
        ctx.rotate(this.spin*Math.PI/180);
        ctx.rotate(this.spinIncrement*Math.PI/180);
        ctx.translate(-offsetXPosition,-offsetYPosition);
        this.spin+=this.spinIncrement;
    }
    counterRotation(){
        //rotating the cube back so it can moved upwards properly
        let offsetXPosition=this.x+(this.width/2);
        let offsetYPosition=this.y+(this.height/2);
        ctx.translate(offsetXPosition,offsetYPosition);
        ctx.rotate(-this.spin*Math.PI/180);
        ctx.translate(-offsetXPosition,-offsetYPosition);
        this.spin+=this.spinIncrement;
    }
    jump(){
       
        if (this.isjumping){
                this.jumpcounter++;
                if(this.jumpcounter<15){
                    //going up
                    this.y-=this.jumpheight;
                }
                else if (this.jumpcounter>14&&this.jumpcounter<19){
                    this.y+=0;
                }
                else{
                    this.y+=this.jumpheight;
                }
                this.rotation() ;
                //ending cycle
                if(this.jumpcounter>=32){
                    this.isjumping=false;
                    this.counterRotation();
                    this.spin=0;
                }
        }
    }
    collectCodePiece(){
        
        this.nbCodePieces++;
        
    }
    completeCode(){
       
        switch(this.nbCodePieces){
            case 1:pieceCode[1].innerText="startGame();"
                pieceCode[1].style.color="green";
                break;
            case 2:pieceCode[2].innerText="animate();"
                pieceCode[2].style.color="green";
                break;
            case 3:pieceCode[3].innerText="player.draw();"
                pieceCode[3].style.color="green";
                break;
            case 4:pieceCode[4].innerText=" if(squaresColliding(player,codePiece)){player.collectCodePiece();player.completeCode();}"
                
                pieceCode[4].style.color="green";
                break;
            case 5:pieceCode[5].innerText=" if (player.     allPiecesCollected){setTimeout(accessSite,2000);}";
                pieceCode[5].style.color="green";
                break
        }
        

    }
    
    draw(){
        this.jump();
        ctx.fillStyle=this.color;       
        ctx.fillRect(this.x,this.y,this.width,this.height);      
        //reset rotation
        if (this.isjumping)this.counterRotation();
    }
}



class Block{
    constructor(size,speed,color){
        if (Math.random()<0.75){
            this.y=height*3/4-size;
        }
        else{
            this.y=height*3/4-size*2;
        }
        this.x=canvas.width+size;        
        this.width=size;
        this.height=size;
        this.color=color;
        this.slideSpeed=speed;
       

    }
    draw(){
        
        ctx.fillStyle=this.color;        
        ctx.fillRect(this.x,this.y,this.width,this.height);
        
        
    }
    slide(){
        this.draw();
        this.x-=this.slideSpeed;
    }
    remove(){
        ctx.clearRect(this.x,this.y,this.width,this.height);
    }
    
}
class CodePiece{
    constructor(widthPiece,heightPiece,speed){
        if (Math.random()<0.75){
            this.y=height*3/4-heightPiece;
        }
        else{
            this.y=height*3/4-heightPiece*2;
        }
        this.x=canvas.width+widthPiece;        
        this.width=widthPiece;
        this.height=heightPiece;        
        this.slideSpeed=speed;

       

    }
    draw(){
        
        ctx.fillStyle=this.color;        
        ctx.drawImage(imgCodePiece,this.x,this.y,this.width,this.height)
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        
        
    }
    slide(){
        this.draw();
        this.x-=this.slideSpeed;
    }
}




//Audo generate blocks
function generateBlocks(){
    
        let timeDelay=randomNumberInterval(presetTime);
        if(gameStarted)arrayBlocks.push(new Block(50,ennemySpeed,"red"));
        setTimeout(generateBlocks,timeDelay);
    
    
}
function generateCodePiece(nbPieces){
    if (gameStarted && !gameOver){
        codePiece=new CodePiece(80,40,codePieceSpeed);
                
        switch(nbPieces){
            case 0:imgCodePiece.src="https://raw.githubusercontent.com/izdinmor/Portfolio/main/startGame.png";
                break;
            case 1:imgCodePiece.src="https://raw.githubusercontent.com/izdinmor/Portfolio/main/animate.png";
                break;
            case 2:imgCodePiece.src="https://raw.githubusercontent.com/izdinmor/Portfolio/main/draw.png";
                break;
            case 3:imgCodePiece.src="https://raw.githubusercontent.com/izdinmor/Portfolio/main/completeCode.png";
                break;
            case 4:imgCodePiece.src="https://raw.githubusercontent.com/izdinmor/Portfolio/main/accessSite.png";
                break;
        }
    }
    
    

}

//Return true if colliding
function squaresColliding(player,block){    

    let s1=Object.assign(Object.create(Object.getPrototypeOf(player)),player);
    let s2=Object.assign(Object.create(Object.getPrototypeOf(block)),block);    
    //collision arent pixel perfect  because the player is rotating
    s2.width=s2.width-10;
    s2.height=s2.height-10;
    s2.x=s2.x+10;
    s2.y=s2.y+10;
    return !(
        s1.x>s2.x+s2.width || //R1 is to the right of R2
        s1.x+s1.width<s2.x || //R1 is to the left of R2
        s1.y>s2.y+s2.height || //R1 is below R2
        s1.y+s1.height<s2.y    //R1 is above R2
    )
}

let animationId=null;

function animate(){
    
    animationId=requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);    
    drawBackgroundLine();    
    player.draw();    
   
        arrayBlocks.forEach((arrayBlock,index)=>{
            arrayBlock.slide(); 
            //end game if player collide enemies        
            if (squaresColliding(player,arrayBlock  )){
                if(!player.allPiecesCollected){
                    gameoverSFX.play();
                    retryCard.style.display="block";
                    cancelAnimationFrame(animationId);
                }
                
            }               
            //Delete the block that goes offscreen
            if(arrayBlock.x+arrayBlock.width<=0){
                setTimeout(()=>{
                    arrayBlocks.splice(index,1);
                },0);
            }
        })
        if(codePiece!=null){
           codePiece.slide();
            if (codePiece.x+codePiece.width<=0){
                codePiece=null;
            }
            if(squaresColliding(player,codePiece)){
               
                codeSFX.play();    
                player.collectCodePiece();
                player.completeCode();
                codePiece=null;
                console.log(player.nbCodePieces);
                if(player.nbCodePieces==nbAllPieces){
                    player.allPiecesCollected=true;
                }     
                  
            }     
            
        }
        else{
            
            setTimeout(generateCodePiece(player.nbCodePieces),randomNumberInterval(presetTime));
        }
        if (player.allPiecesCollected){
            gameOver=true;
            codeCompleteCard.style.display="block";
            setTimeout(accessSite,2000);

        }
    
   
    
}

startGame();
animate();
setTimeout(generateBlocks(),randomNumberInterval(presetTime));



//even listeners

addEventListener("keydown",e=>{
    if(!gameStarted){
        gameStarted=true;
    }
    if(gameStarted && !gameOver){
        if(!player.isjumping){
            if(e.code=="Space"){       
                jumpSFX.play();
                player.jumpcounter=0;
                player.isjumping=true;
                
            
            }
            if(e.code=="ArrowDown"){
                if(!player.iscrouching){            
                    //player.isjumping=false;
                    player.height=player.height/2;
                    player.y=player.y+player.height;
                    player.iscrouching=true;
                }            
            }        
        } 
    }
     
    
})

addEventListener("keyup",e=>{
    if(e.code=="ArrowDown"){ 
        if(player.iscrouching)
        {
            player.y=player.y-player.height;               
            player.height=player.height*2;            
            player.iscrouching=false;            
        }       
        
    }
})
