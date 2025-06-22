document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const display = document.querySelector('.display');
    const millisecondsDisplay = document.querySelector('.milliseconds');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    const resetBtn = document.getElementById('reset');
    const lapBtn = document.getElementById('lap');
    const lapList = document.getElementById('lap-list');
    const noLapsDiv = document.querySelector('.no-laps');
    const bestLapDisplay = document.getElementById('best-lap');
    const avgLapDisplay = document.getElementById('avg-lap');
    const lastSessionDisplay = document.getElementById('last-session');
    const clearLapsBtn = document.getElementById('clear-laps');
    const exportLapsBtn = document.getElementById('export-laps');
    const themeToggle = document.querySelector('.theme-toggle');
    const stopwatchContainer = document.querySelector('.stopwatch');
    const countdownToggle = document.getElementById('countdown-toggle');
    const countdownSettings = document.querySelector('.countdown-settings');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    const setCountdownBtn = document.getElementById('set-countdown');
    
    // Variables for time tracking
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let lapTimes = [];
    let lastLapTime = 0;
    let running = false;
    let countdownMode = false;
    let countdownTime = 0;
    let bestLapTime = Infinity;
    let worstLapTime = 0;
    
    loadFromLocalStorage();

    function formatTime(timeInMilliseconds) {
        let negative = timeInMilliseconds < 0;
        timeInMilliseconds = Math.abs(timeInMilliseconds);
    
        let hours = Math.floor(timeInMilliseconds / 3600000);
        let minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
        let seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
        let milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
        
     
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        milliseconds = milliseconds.toString().padStart(2, '0');
        
        return `${negative ? '-' : ''}${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
   
    function formatMainTime(timeInMilliseconds) {
        let negative = timeInMilliseconds < 0;
        timeInMilliseconds = Math.abs(timeInMilliseconds);
        
        let hours = Math.floor(timeInMilliseconds / 3600000);
        let minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
        let seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
        
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        
        return `${negative ? '-' : ''}${hours}:${minutes}:${seconds}`;
    }
    
 
    function formatMilliseconds(timeInMilliseconds) {
        let milliseconds = Math.floor((Math.abs(timeInMilliseconds) % 1000) / 10);
        return milliseconds.toString().padStart(2, '0');
    }
    
   
    function updateDisplay() {
        const currentTime = Date.now();
        let totalTime;
        
        if (countdownMode) {
            totalTime = countdownTime - elapsedTime - (running ? currentTime - startTime : 0);
            if (totalTime <= 0 && running) {
                totalTime = 0;
                stopTimer();
                showNotification("Countdown completed!");
                playSound();
            }
        } else {
            totalTime = elapsedTime + (running ? currentTime - startTime : 0);
        }
        
        display.textContent = formatMainTime(totalTime);
        millisecondsDisplay.textContent = '.' + formatMilliseconds(totalTime);
    }
    

    function startTimer() {
        if (!running) {
            running = true;
            startTime = Date.now();
            timerInterval = setInterval(updateDisplay, 10);
            stopwatchContainer.classList.add('active');
            
            startBtn.disabled = true;
            stopBtn.disabled = false;
            
        
            if (countdownMode) {
                const totalTime = countdownTime - elapsedTime - (Date.now() - startTime);
                if (totalTime <= 0) {
                    stopTimer();
                    return;
                }
            }
        }
    }
    

    function stopTimer() {
        if (running) {
            running = false;
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
            stopwatchContainer.classList.remove('active');
            
            startBtn.disabled = false;
            stopBtn.disabled = true;
            
            // Save session time to localStorage
            saveLastSession(elapsedTime);
        }
    }
    

    function resetTimer() {
        stopTimer();
        startTime = 0;
        elapsedTime = 0;
        lastLapTime = 0;
        updateDisplay();
    }
    
  
    function addLap() {
        if (running || elapsedTime > 0) {
            const currentTime = Date.now();
            const totalTime = elapsedTime + (running ? currentTime - startTime : 0);
            
      
            const lapTime = lastLapTime === 0 ? totalTime : totalTime - lastLapTime;
            lastLapTime = totalTime;
            
         
            lapTimes.push({
                number: lapTimes.length + 1,
                time: lapTime,
                totalTime: totalTime
            });
            
   
            updateLapsList();
            updateStats();
            saveLapsToLocalStorage();
            
         
            showNotification(`Lap ${lapTimes.length} recorded!`);
        }
    }

    function updateLapsList() {
        lapList.innerHTML = '';
        
        if (lapTimes.length > 0) {
            noLapsDiv.classList.add('hide');
         
            bestLapTime = Math.min(...lapTimes.map(lap => lap.time));
            worstLapTime = Math.max(...lapTimes.map(lap => lap.time));
         
            for (let i = lapTimes.length - 1; i >= 0; i--) {
                const lap = lapTimes[i];
                const li = document.createElement('li');
           
                let diffClass = '';
                let diffText = '';
                
                if (i > 0) {
                    const diff = lap.time - lapTimes[i-1].time;
                    diffText = (diff >= 0 ? '+' : '') + formatTime(diff);
                    diffClass = diff < 0 ? 'faster' : diff > 0 ? 'slower' : '';
                }

                if (lap.time === bestLapTime) {
                    li.classList.add('best');
                } else if (lap.time === worstLapTime) {
                    li.classList.add('worst');
                }
                
                li.innerHTML = `
                    <span class="lap-number">Lap ${lap.number}</span>
                    <span class="lap-time">${formatTime(lap.time)}</span>
                    <span class="lap-diff ${diffClass}">${diffText}</span>
                `;
                
                lapList.appendChild(li);
            }
        } else {
            noLapsDiv.classList.remove('hide');
        }
    }
    
    function updateStats() {
        if (lapTimes.length > 0) {
            const bestLap = Math.min(...lapTimes.map(lap => lap.time));
            bestLapDisplay.textContent = formatTime(bestLap);
            
            const totalTime = lapTimes.reduce((sum, lap) => sum + lap.time, 0);
            const avgLap = totalTime / lapTimes.length;
            avgLapDisplay.textContent = formatTime(avgLap);
        }
    }

    function clearLaps() {
        lapTimes = [];
        lastLapTime = 0;
        updateLapsList();
        updateStats();
        saveLapsToLocalStorage();
    }
    

    function exportLaps() {
        if (lapTimes.length === 0) {
            showNotification("No laps to export");
            return;
        }
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Lap Number,Lap Time,Total Time\n";
        
        lapTimes.forEach(lap => {
            csvContent += `${lap.number},${formatTime(lap.time)},${formatTime(lap.totalTime)}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "stopwatch_laps.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification("Laps exported successfully!");
    }
    

    function toggleTheme() {
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = themeToggle.querySelector('.fa-sun');
        
        if (document.body.classList.toggle('dark-mode')) {
            moonIcon.classList.add('hide');
            sunIcon.classList.remove('hide');
            localStorage.setItem('stopwatch-theme', 'dark');
        } else {
            sunIcon.classList.add('hide');
            moonIcon.classList.remove('hide');
            localStorage.setItem('stopwatch-theme', 'light');
        }
    }
    

    function showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    

    function playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 880; // A5
        gainNode.gain.value = 0.5;
        
        oscillator.start();
        
    
        setTimeout(() => {
            oscillator.stop();
        }, 200);

        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            oscillator2.connect(gainNode);
            oscillator2.type = 'sine';
            oscillator2.frequency.value = 1046.5; // C6
            
            oscillator2.start();
            setTimeout(() => {
                oscillator2.stop();
            }, 200);
        }, 300);
    }
    
    function saveLastSession(time) {
        localStorage.setItem('stopwatch-last-session', time);
        lastSessionDisplay.textContent = formatTime(time);
    }
    
    function saveLapsToLocalStorage() {
        localStorage.setItem('stopwatch-laps', JSON.stringify(lapTimes));
    }
    
    function loadFromLocalStorage() {
   
        const theme = localStorage.getItem('stopwatch-theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.querySelector('.fa-moon').classList.add('hide');
            themeToggle.querySelector('.fa-sun').classList.remove('hide');
        }
        
 
        const lastSession = localStorage.getItem('stopwatch-last-session');
        if (lastSession) {
            lastSessionDisplay.textContent = formatTime(parseInt(lastSession));
        }
        
 
        const savedLaps = localStorage.getItem('stopwatch-laps');
        if (savedLaps) {
            lapTimes = JSON.parse(savedLaps);
            updateLapsList();
            updateStats();
        }
    }
    

    function setCountdown() {
        const minutes = parseInt(countdownMinutes.value) || 0;
        const seconds = parseInt(countdownSeconds.value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            showNotification("Please set a valid countdown time");
            return;
        }
        
        countdownTime = (minutes * 60 + seconds) * 1000;
        resetTimer();
        showNotification(`Countdown set: ${minutes}m ${seconds}s`);
    }
    

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', addLap);
    clearLapsBtn.addEventListener('click', clearLaps);
    exportLapsBtn.addEventListener('click', exportLaps);
    themeToggle.addEventListener('click', toggleTheme);
    
    countdownToggle.addEventListener('change', function() {
        countdownMode = this.checked;
        if (countdownMode) {
            countdownSettings.classList.remove('hide');
            resetTimer();
        } else {
            countdownSettings.classList.add('hide');
            resetTimer();
        }
    });
    
    setCountdownBtn.addEventListener('click', setCountdown);
    

    updateDisplay();
    

    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (running) {
                stopTimer();
            } else {
                startTimer();
            }
        } else if (e.code === 'KeyR') {
            resetTimer();
        } else if (e.code === 'KeyL') {
            addLap();
        }
    });
});