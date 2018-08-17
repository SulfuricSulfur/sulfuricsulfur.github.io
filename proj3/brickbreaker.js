var xmlns = 'http://www.w3.org/2000/svg';
    var svg = document.getElementById("svgRoot");
	//the ball
	var dirX = -1;
	var dirY = -1;
	var speed = 6;
	var ball = document.createElementNS(xmlns, 'circle');
	var rad =20;
	
	//paddle
	var paddle = document.createElementNS(xmlns, 'rect');
	
	//block
	var bricks=[];
	var brickTot, brickCol, brickRow, brickBroke;
	var brickTopOff = 30;
	var brickLeftOff = 30;
	var brickWidth = 75;
	var brickHeight = 30;
	var brick = document.createElementNS(xmlns, 'rect');

	var score = 0;
	var scoreIncrease = 5;//how much to increase score by
	var levelIncrease =0;//everytime player beats a level will will be added on. Will increase each time
	var lives = 3;
	var scoreName;//name of person 
	
	//for highschore localdata.
	var highScore;
	var highName;

	
	var svgWidth= 800;
	var svgHeight=600;
	document.addEventListener('mousemove', movePaddle);
	document.addEventListener('click',ShootBall);
	
	var canMove=false;
	

	
	var audio1 = document.createElement('audio');
	audio1.setAttribute('src', 'Ballbouce.wav');
	var audio2 = document.createElement('audio');
	audio2.setAttribute('src', 'lose.wav');
	var audio3 = document.createElement('audio');
	audio3.setAttribute('src', 'win.mp3');
	
	function CreateBall(){
		
		svg.appendChild(ball);
		ball.setAttribute('cx', (svgWidth/2) -50);
		ball.setAttribute('cy',svgHeight - 50);
		ball.setAttribute('r', rad);
		ball.className="ball";
		ball.setAttribute('class', "ball");
		//ball.style.fill='rgba(' + 256 + ',' + 256 + ',' + 256 + ',.3)';
	}
	
	function RespawnBall(){
		if(canMove==false){
		var add =parseFloat(paddle.getAttribute('width'))/2;
		var posX= parseFloat(paddle.getAttribute('x'));
		var posY=paddle.getAttribute('y') - 50;
		var posX2=posX + add;
		var isNotNum = isNaN(posX2);
		if(isNotNum==true){
			//to make sure it is a number
			posX2=svgWidth/2;
		}
		ball.setAttribute('cx',posX2);
		ball.setAttribute('cy',posY);
		ball.setAttribute('r', 20);	
		dirX =0;
		dirY =0;
		}
	}
	
	function CreatePaddle(){
		paddle.className="paddle";
		paddle.setAttribute('class', "paddle");
		svg.appendChild(paddle);
		paddle.setAttribute('x',svgWidth/2);
		paddle.setAttribute('y',svgHeight-30);
		paddle.setAttribute('width',svgWidth/6);
		paddle.setAttribute('height',30);
		
	}
	
	function ShootBall()
	{
		if(canMove==false){
			dirX =0;
			dirY =-1;
			canMove=true;
		}
	}
	
	function CreateBrick(x,y)
	{
		var isDead=false;
		var rect = document.createElementNS(xmlns, 'rect');
		svg.appendChild(rect);
		rect.setAttribute('width', brickWidth);
		rect.setAttribute('height', brickHeight);
		//if the brick is not broken, draw it
		this.drawingCollide = function(){
			//if the brick is dead, exit
				if(isDead==true)
				{
					return;
				}		
			rect.setAttribute('x', x);
			rect.setAttribute('y', y);
			
			
			var bb = ball.getBoundingClientRect();
			var brB = rect.getBoundingClientRect();
			rect.className="brick";
			rect.setAttribute('class', "brick");
		
			var overlapping = !(brB.left > bb.right || brB.right < bb.left || brB.top > bb.bottom || brB.bottom < bb.top)
			if (overlapping==true)
			{
				this.remove();
				dirY *=-1;	
				//dirX *=-1;
				isDead=true;
				audio1.play();
				brickBroke++;
				score += scoreIncrease;
				
			}
		};
		
		this.remove = function(){
			if(isDead==true)
			{
				return;
			}
			svg.removeChild(rect);
		};
	}
	
	
	function DisplayHighScore(){
		highScore= localStorage.getItem('hs');
		highName= localStorage.getItem('hname');
		if(highScore == null)
		{
			highScore=0;
			highName="No one";
		}
		document.getElementById('leader').innerHTML= "High score: " + highName + " : " + highScore;
		
	}
	
		
	function SetUpBricks(){
		   // Removing previous ones
		for (var index = 0; index < bricks.length; index++) {
			bricks[index].remove();
		}
		brickCol=Math.floor(Math.random()*(7-2))+2;
		brickRow=Math.floor(Math.random()*(7-3))+3;;
		brickTot= brickCol*brickRow;
		var brickId=0;
		var offset= (svgWidth-brickCol*(brickWidth+brickLeftOff))/2.0;
		for(var x=0; x<brickCol; x++)
		{
			for(var y=0; y< brickRow; y++)
			{
				bricks[brickId++]= new CreateBrick(offset+x*(brickWidth+brickLeftOff), y*(brickHeight+brickLeftOff)+brickTopOff);

			}
		}	
	}
	
	

	function ReverseSpd(ball){

		if(ball.getAttribute('cx')+rad > svgWidth || ball.getAttribute('cx')- ball.getAttribute('r') < 0){
			dirX *=-1;
			audio1.play();
			
		}
		if( ball.getAttribute('cy') - ball.getAttribute('r') < 0 ){
			audio1.play();
			dirY *=-1;	
		}
	}
	
	function BallDie(){
		if(ball.getAttribute('cy')  >svgHeight)
		{
			lives--;
			audio2.play();
			canMove=false;
		}
	}
	
	function updateText(){
		document.getElementById('score').innerHTML = "Score: " + score;
		document.getElementById('lives').innerHTML = "Lives: " + lives;
		
	}
	
	//moving the ball
	function Move()
	{
		if(canMove==true){
		ReverseSpd(ball);
		var x2 = parseFloat(ball.getAttribute('cx'));
		
		x2+=speed * dirX;
		ball.setAttribute('cx',x2);
		var y2 = parseFloat(ball.getAttribute('cy'));
		y2+= speed*dirY;
		ball.setAttribute('cy',y2);
		}
	}
	
	//ball colliding with the paddle
	function BallPaddle()
	{
		var bb = ball.getBoundingClientRect();
		var pb = paddle.getBoundingClientRect();
		
		var overlapping = !(pb.left > bb.right || pb.right < bb.left || pb.top > bb.bottom || pb.bottom < bb.top)
		if (overlapping==true)
		{
			audio1.play();
			//dirY *=-1;
			var bX = parseFloat(ball.getAttribute('cx'));
			var by = parseFloat(ball.getAttribute('cy'));
			var padX= parseFloat(paddle.getAttribute('x'));
			dirY *=-1;
			
			var dist = bX - (padX + (parseFloat(paddle.getAttribute('width')) )/2);
			dirX = 2* dist /parseFloat(paddle.getAttribute('width'));
			var sq = Math.sqrt((dirX*dirX)+ (dirY*dirY));
			dirX = dirX/sq;
			dirY = dirY/sq;
		}
		
	}
	
	
	function movePaddle(e)
	{

		if(e.clientX+ (paddle.getAttribute('width')/2) < svgWidth && e.clientX - (paddle.getAttribute('width')/2) >0){
		paddle.setAttribute('x',(e.clientX -(paddle.getAttribute('width')/2))+'px' );
		}
	}
	

	
	function init(){
		brickBroke=0;
		CreatePaddle();
		CreateBall();
		SetUpBricks();
		Move();	
		DisplayHighScore();
	}
	
	function win()
	{	//collided with all the bricks on the screen, make new ones.
		if(brickBroke >= brickTot)
		{
			audio3.play();
			alert("Level completed! Moving on to next level!");
			canMove=false; 
			RespawnBall();
			brickBroke=0;
			//giving player score bonus for finishing level
			levelIncrease +=50;
			score +=levelIncrease;
			//increasing speed for the next level
			speed += 2;
			SetUpBricks();
			
		}
	}
	
	function lose()
	{
		if(lives <= 0){
			audio2.play();
			alert("GAME OVER!" + "\n Your score is: " + score);
			scoreName=prompt("Please enter your name:", "");
			highScore= localStorage.getItem('hs');
			if(highScore !== null)
			{
				if(score > highScore)
				{
					localStorage.setItem('hs',score);
					localStorage.setItem('hname',scoreName);
				}
			}
			else{
				localStorage.setItem('hs',score);
				localStorage.setItem('hname',scoreName);
			}
			document.location.reload();
		}
	}
	
	function GameLoop(){
	
		
		BallDie();
		BallPaddle();
		for(var i =0; i < bricks.length; i++)
		{
			bricks[i].drawingCollide();
		}
		RespawnBall();
		Move();
		updateText();
		win();
		lose();
	}
	window.onload=init;
	setInterval(GameLoop,16);
	
	

	 
	
	
	