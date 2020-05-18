var canvas;
var context;

var intervalId;

// change this to modify speed. 2.0 is twice as fast, etc.
var SPEED_MODIFIER = 1.0;
var SPEED = 1000 / SPEED_MODIFIER;
var FRAME_INTERVAL = 20;

var time;

function init() {
	intervalId = setInterval(update, FRAME_INTERVAL);
	window.requestAnimationFrame(draw);
	time = Date.now();
}

var waterline = 0;
var rate = 1000;
var buffer = rate;
var drops = [];
var total = 0;

function update() {
	rate = 1000 / (1 + total / 20);
	let newTime = Date.now();
	let elapsed = newTime - time;
	time = newTime;
	
	buffer += elapsed;
	
	let spawn = Math.floor(buffer / rate);
	
	if (spawn > 0) {
		buffer %= rate;
		for (let i = 0; i < spawn; i++) {
			let r = 12 + Math.floor(Math.random() * 12);
			drops.push({
				x: Math.floor(Math.random() * canvas.width),
				y: -r - Math.floor(Math.random() * 10),
				r: r,
				v: 0
			})
		}
	}

	for (let i = drops.length - 1; i >= 0; i--) {
		let drop = drops[i];
		drop.v += elapsed * 1/128;
		drop.y += drop.v;
		if (drop.y - drop.r >= canvas.height - waterline) { 
			drops.splice(i, 1);
			total++;
			console.log(total);
			waterline += Math.PI * drop.r * drop.r / 1600;
		}
	}
	
}

function draw() {
	canvas = document.getElementById('screen');
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = 'red';
	for (let drop of drops) {
		drawCircle(drop.x, drop.y, drop.r);
	}
	context.rect(0, canvas.height - waterline, canvas.width, waterline);
	context.fill();
	window.requestAnimationFrame(draw);
}

function drawCircle(x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
}

window.onload = init;
