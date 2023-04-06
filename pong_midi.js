const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

const paddleWidth = 10;
const paddleHeight = 100;

const leftPaddle = { x: 20, y: canvas.height / 2 - paddleHeight / 2 };
const rightPaddle = { x: canvas.width - 20 - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };

const ball = { x: canvas.width / 2, y: canvas.height / 2, size: 10, dx: 3, dy: 3 };

function playMidiNote() {
    const midiNote = 21 + Math.floor(Math.random() * 88);
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 200);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';

    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    if (ball.x + ball.size > canvas.width) {
        if (ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight) {
            ball.dx *= -1;
            playMidiNote();
        } else {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }
    }

    if (ball.x - ball.size < 0) {
        if (ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) {
            ball.dx *= -1;
            playMidiNote();
        } else {
            ball.x = canvas.width / 2;
            ball.y =
