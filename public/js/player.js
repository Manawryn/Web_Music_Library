const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.querySelector('.img-container img');

//information about song in json file and here
const artistElement = document.getElementById('artist');
const descriptionElement = document.getElementById('description');
const yearElement = document.getElementById('year');
const genreElement = document.getElementById('genre');
const ratingElement = document.getElementById('rating');


const timeLeft = document.getElementById('timeLeft');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');


const songs = ['Please', '7_rings', 'All_I_want', 'Jupiter_and_Mars', 'Alive', 'Always_Waiting', 'Erase', 'Dame_Mas', 'Good_Morning', 'Goodbar_Good_Night', 'I_Got_a_Boy', 'Love_of_My_Life', 'Mr_Rock', 'Reason_to_Stay', 'Stranger_Things', 'Use', 'Fire_fighter'];
let songIndex = 0;
let currentSound;
// here fetch data to be able to display
fetch('/ada_we/json/songs.json')
    .then(response => response.json())
    .then(data => {
        songData = data;
        loadSong(songs[songIndex]);
    })
    .catch(error => {
        console.error('Error loading song data:', error);
    });

// Displaying song and information about song + connected to json file 
// I am storing information about song in json file
function loadSong(song) {
    title.innerText = song;
    cover.src = `/ada_we/images/${song}.jpeg`;

    if (songData[song]) {
        artistElement.innerText = `Artist: ${songData[song].artist}`;

    }
    // adding loop to be able to listen only one sound, not multiple
    if (currentSound) {
        currentSound.stop();
        currentSound.unload();
    }

    //using howler.js library to be able to listen chosen song
    currentSound = new Howl({
        src: [`/ada_we/audio/music/${song}.mp3`],
        volume: 0.7,
        preload: true,
        onplay: updateProgress,
        onend: nextSong,
    });

}




// Play the song
function playSong() {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        currentSound.pause(); // Pause current sing
        musicContainer.classList.remove('play');
        playBtn.querySelector('i.fas').classList.add('fa-play');
        playBtn.querySelector('i.fas').classList.remove('fa-pause');
    } else {
        currentSound.play();
        musicContainer.classList.add('play');
        playBtn.querySelector('i.fas').classList.remove('fa-play');
        playBtn.querySelector('i.fas').classList.add('fa-pause');
    }
}



// Pause the song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');

    if (currentSound) {
        currentSound.pause();
    }
}



function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    currentSound.play();

}

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    currentSound.play();
}








// Update the progress bar fo r soong
function updateProgress() {
    if (currentSound && currentSound.playing()) {
        const totalDuration = currentSound.duration() || 0;
        const currentPlayTime = currentSound.seek() || 0;
        const remainingTime = totalDuration - currentPlayTime;

        const progressPercent = (currentPlayTime / totalDuration) * 100;
        progress.style.width = `${progressPercent}%`;

        currentTime.innerText = formatTime(currentPlayTime);
        duration.innerText = formatTime(totalDuration);
        timeLeft.innerText = `-${formatTime(remainingTime)}`;
    }

    requestAnimationFrame(updateProgress);
}



function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = currentSound.duration();

    currentSound.seek((clickX / width) * duration);
}

//updating my profress bar 
function updateProgressBar() {
    if (currentSound) {
        const progress = document.querySelector('.progress');
        const duration = currentSound.duration();
        const currentTime = currentSound.currentTime();
        const width = (currentTime / duration) * 100;
        progress.style.width = width + '%';
    }
}

setInterval(updateProgressBar, 1000);





playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});




// Changing songs
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

//loading initialized song
loadSong(songs[songIndex]);


//shuffle
function randomsong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
    songIndex = randomIndex;
    loadSong(songs[songIndex]);
    playSong();
}



/// for update
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

//make sure your browser has permission to clipboard
