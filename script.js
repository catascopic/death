const RADIUS = 8;
const DIAMETER = RADIUS * 2;
const SIN_60 = 0.86602540378;

const FRAME_INTERVAL = 20;
const BASE_RATE = 2000;
const SPEED = 10;

var intervalId;
var canvas;
var context;

function init() {	
	canvas = document.getElementById('screen');
	context = canvas.getContext('2d');
	baseRowCount = canvas.width / DIAMETER;
	startTime = Date.now();
	lastTime = startTime;
	loadQueue();
	update();
	intervalId = setInterval(update, FRAME_INTERVAL);
	window.requestAnimationFrame(draw);
}

var lastTime;
var startTime;

var baseRowCount;
var rate = BASE_RATE;
var buffer = 0;
var queue = [];
var used = 0;
var row = 0;

function loadQueue() {
	let rowCount = baseRowCount - (row % 2);
	for (let i = 0; i < rowCount; i++) {
		queue.push({
			x: RADIUS * (1 + i * 2 + (row % 2)),
			y: -RADIUS,
			v: 0,
			row: row
		});
	}
	shuffle(queue, used);
}

function update() {
	let time = Date.now();
	let elapsed = time - lastTime;
	lastTime = time;
	buffer += elapsed;
	
	let spawn = Math.floor(buffer / rate);
	buffer %= rate;
	used += spawn;
	rate = Math.floor(BASE_RATE / (1 + SPEED * used / baseRowCount));
	
	if (spawn > queue.length - used) {
		row++;
		console.log(row + ' rows completed in ' + (time - startTime) / 1000 + ' sec');
		loadQueue();
	}

	for (let i = used - 1; i >= 0; i--) {
		let drop = queue[i];
		drop.v += elapsed * 1 / 128;
		drop.y = Math.min(drop.y + drop.v, canvas.height - RADIUS - (drop.row * DIAMETER * SIN_60));
	}
}

function draw() {
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = 'black';
	
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	context.fillStyle = 'white';
	for (let drop of queue) {
		drawCircle(drop.x, drop.y, RADIUS);
	}

	window.requestAnimationFrame(draw);
}

function drawCircle(x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
}


function shuffle(array, start) {
	for (let i = array.length - 1; i > start; i--) {
		swap(array, i, randInt(start, i));
	}
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function swap(array, i, j) {
	let temp = array[i];
	array[i] = array[j];
	array[j] = temp;
}

window.onload = init;
