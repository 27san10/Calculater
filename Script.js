// Stopwatch variables
let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
let interval, isRunning = false;
let laps = [], lapCounter = 0;
let lastLapTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

// Update the display function
function updateDisplay() {
    const display = document.getElementById('display');
    let formattedHours = hours < 10 ? '0' + hours : hours;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMilliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;
    display.innerHTML = `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        interval = setInterval(() => {
            milliseconds += 10;
            if (milliseconds === 1000) {
                milliseconds = 0;
                seconds++;
            }
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
            updateDisplay();
        }, 10);
        isRunning = true;
        enableButtons(['pauseBtn', 'lapBtn', 'stopBtn']);
        disableButtons(['startBtn']);
    }
}

// Pause the stopwatch
function pauseStopwatch() {
    clearInterval(interval);
    isRunning = false;
    disableButtons(['pauseBtn']);
    enableButtons(['resumeBtn']);
}

// Resume the stopwatch
function resumeStopwatch() {
    startStopwatch();
    disableButtons(['resumeBtn']);
    enableButtons(['pauseBtn']);
}

// Stop the stopwatch
function stopStopwatch() {
    clearInterval(interval);
    isRunning = false;
    disableButtons(['pauseBtn', 'lapBtn']);
    enableButtons(['resetBtn']);
}

// Reset the stopwatch
function resetStopwatch() {
    stopStopwatch();
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    laps = [];
    lapCounter = 0;
    lastLapTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    document.getElementById('lapsList').innerHTML = '';
    updateDisplay();
    disableButtons(['resetBtn', 'lapBtn', 'resumeBtn', 'stopBtn']);
    enableButtons(['startBtn']);
}

// Record lap time
function recordLap() {
    lapCounter++;
    let currentLap = {
        lap: lapCounter,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
    };
    laps.push(currentLap);
    
    // Calculate lap time difference
    let lapTimeDifference = calculateTimeDifference(lastLapTime, currentLap);
    lastLapTime = { ...currentLap };

    let lapElement = document.createElement('li');
    lapElement.innerHTML = `Lap ${lapCounter}: ${formatTime(lapTimeDifference.hours, lapTimeDifference.minutes, lapTimeDifference.seconds, lapTimeDifference.milliseconds)}`;
    document.getElementById('lapsList').appendChild(lapElement);
}

// Calculate time difference for lap summary
function calculateTimeDifference(start, end) {
    let startMilliseconds = (start.hours * 3600000) + (start.minutes * 60000) + (start.seconds * 1000) + start.milliseconds;
    let endMilliseconds = (end.hours * 3600000) + (end.minutes * 60000) + (end.seconds * 1000) + end.milliseconds;
    let diff = endMilliseconds - startMilliseconds;

    let diffHours = Math.floor(diff / 3600000);
    diff %= 3600000;
    let diffMinutes = Math.floor(diff / 60000);
    diff %= 60000;
    let diffSeconds = Math.floor(diff / 1000);
    let diffMilliseconds = diff % 1000;

    return { hours: diffHours, minutes: diffMinutes, seconds: diffSeconds, milliseconds: diffMilliseconds };
}

// Format time for display
function formatTime(hours, minutes, seconds, milliseconds) {
    let formattedHours = hours < 10 ? '0' + hours : hours;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMilliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

// Enable and disable buttons
function enableButtons(buttonIds) {
    buttonIds.forEach(id => {
        document.getElementById(id).disabled = false;
    });
}

function disableButtons(buttonIds) {
    buttonIds.forEach(id => {
        document.getElementById(id).disabled = true;
    });
}

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', startStopwatch);
document.getElementById('pauseBtn').addEventListener('click', pauseStopwatch);
document.getElementById('resumeBtn').addEventListener('click', resumeStopwatch);
document.getElementById('stopBtn').addEventListener('click', stopStopwatch);
document.getElementById('resetBtn').addEventListener('click', resetStopwatch);
document.getElementById('lapBtn').addEventListener('click', recordLap);

// On page load, reset stopwatch
resetStopwatch();