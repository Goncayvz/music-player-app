// Buton durumunu güncelleyen fonksiyon
function updatePlayPauseButton(action) {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playSVG = `<svg width="14" height="16" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0L16.1852 9.5L1.88952e-07 19L0 0Z"/></svg>`;
    const pauseSVG = `<svg width="14" height="16" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6.54013e-07H4.75V19H0V6.54013e-07Z"/><path d="M11.4 0H16.15V19H11.4V0Z"/></svg>`;
    
    playPauseBtn.innerHTML = action === 'play' ? playSVG : pauseSVG;
    playPauseBtn.setAttribute('aria-label', action === 'play' ? 'Play' : 'Pause');
    
    // CSS class güncelleme
    if (action === 'play') {
        playPauseBtn.classList.remove('playing');
    } else {
        playPauseBtn.classList.add('playing');
    }
}
const playlistSongs = document.getElementById("playlist-songs");
const playPauseBtn = document.getElementById("play-pause-btn");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const progressBar=document.getElementById("progress-bar");
const currentTimeElement=document.getElementById("current-time");
const durationElement=document.getElementById("duration"); 
const volumeBtn=document.getElementById("volume-btn");
const volumeSlider=document.getElementById("volume-slider");
const repeatButton = document.getElementById("repeat");
const themeToggle = document.getElementById("theme-toggle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
  volume:50,
  isMuted:false,
  repeatMode:"off",
  theme: "dark"
};
const togglePlayPause = () => {
    if (audio.paused) {
        playSong(userData?.currentSong?.id || userData?.songs[0]?.id);
    } else {
        pauseSong();
    }
}; 

// volume kontrol
const updateVolume =()=>{
  const volumeValue=volumeSlider.value;
  audio.volume=volumeValue/100;
  userData.volume=volumeValue;
  if(volumeValue==0 && !userData.isMuted){
    toggleMute();
  }else if(volumeValue >0 && userData.isMuted){
    toggleMute();
  }
  updateVolumeIcon();
};

const updateRepeatButton = () => {
  // CSS class'larını temizle
  repeatButton.classList.remove("repeat-off", "repeat-all", "repeat-one");
  
  // Yeni moda göre class ekle
  repeatButton.classList.add(`repeat-${userData.repeatMode}`);
  
  // ARIA label'ı güncelle
  const labels = {
    off: "Repeat Off",
    all: "Repeat All",
    one: "Repeat One"
  };
  repeatButton.setAttribute("aria-label", labels[userData.repeatMode]);
};
const toggleTheme = () => {
  userData.theme = userData.theme === "dark" ? "light" : "dark";
  applyTheme();
  saveUserData();
};

const applyTheme = () => {
  document.body.className = `${userData.theme}-theme`;
  updateThemeButton();
};

const updateThemeButton = () => {
  const labels = {
    dark: "Switch to light theme",
    light: "Switch to dark theme"
  };
  themeToggle.setAttribute("aria-label", labels[userData.theme]);
};
// Kullanıcı verilerini kaydetme
const saveUserData = () => {
  localStorage.setItem('musicPlayerData', JSON.stringify(userData));
};

const loadUserData = () => {
  const saved = localStorage.getItem('musicPlayerData');
  if (saved) {
    const parsed = JSON.parse(saved);
    userData = { ...userData, ...parsed };
    applyTheme();
    updateThemeButton();
    
    // Volume'u da yükle
    audio.volume = userData.volume / 100;
    volumeSlider.value = userData.volume;
    updateVolumeIcon();
  }
};
const toggleMute = () => {
  userData.isMuted = !userData.isMuted;
  
  if (userData.isMuted) {
    audio.volume = 0;
    volumeBtn.classList.add("muted");
    volumeBtn.setAttribute("aria-label", "Unmute");
  } else {
    audio.volume = userData.volume / 100;
    volumeBtn.classList.remove("muted");
    volumeBtn.setAttribute("aria-label", "Mute");
  }
};
const toggleRepeatMode =()=>{
  const modes=["off","all","one"];
  const currentIndex=modes.indexOf(userData.repeatMode);
  userData.repeatMode=modes[(currentIndex + 1)% modes.length];
   updateRepeatButton();
};
const updateVolumeIcon = () => {
  if (userData.isMuted || userData.volume == 0) {
    volumeBtn.classList.add("muted");
    volumeBtn.setAttribute("aria-label", "Unmute");
  } else {
    volumeBtn.classList.remove("muted");
    volumeBtn.setAttribute("aria-label", "Mute");
  }
};

//Zaman formatı dönüştürücü
const formatTime=(seconds)=>{const minutes=Math.floor(seconds/60);
  const remainingSeconds=Math.floor(seconds%60);
  return `${minutes}:${remainingSeconds < 10 ?'0':''}${remainingSeconds}`;
};
const updateProgressBar =()=>{
  if(audio.duration){
    const progress=(audio.currentTime / audio.duration)*100;
    progressBar.value=progress;
    currentTimeElement.textContent=formatTime(audio.currentTime);
  }
}
const updateDuration=()=>{
  if(audio.duration){
    durationElement.textContent=formatTime(audio.duration);
  }
};
const seekAudio=()=>{
  const seekTime=(progressBar.value/100)*audio.duration;
  audio.currentTime=seekTime;
};
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
    progressBar.value=0;
    currentTimeElement.textContent="0:00";
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  updatePlayPauseButton('pause');

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  updatePlayPauseButton('play');
  audio.pause();
  updateProgressBar();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
   if (userData?.currentSong === null) return;
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  };

};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

 playPauseBtn.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);
playPauseBtn.addEventListener("click", togglePlayPause);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("timeupdate",updateProgressBar);

audio.addEventListener("loadedmetadata",updateDuration);

audio.addEventListener("canplay",updateDuration);

progressBar.addEventListener("input",seekAudio);

volumeSlider.addEventListener("input",updateVolume);

volumeBtn.addEventListener("click",toggleMute);
 
repeatButton.addEventListener("click",toggleRepeatMode);

themeToggle.addEventListener("click", toggleTheme);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  
  // Repeat moduna göre davranış
  switch (userData.repeatMode) {
    case "one":
      // Aynı şarkıyı tekrar çal
      playSong(userData.currentSong.id);
      break;
      
    case "all":
      // Tüm listeyi tekrarla
      const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
      if (nextSongExists) {
        playNextSong();
      } else {
        // Listenin sonuna geldi, başa dön
        playSong(userData.songs[0].id);
      }
      break;
      
    case "off":
    default:
      // Normal davranış
      const nextSongExistsNormal = userData?.songs[currentSongIndex + 1] !== undefined;
      if (nextSongExistsNormal) {
        playNextSong();
      } else {
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        progressBar.value = 0;
        currentTimeElement.textContent = "0:00";
        durationElement.textContent = "0:00";
        pauseSong();
        setPlayerDisplay();
        highlightCurrentSong();
        setPlayButtonAccessibleText();
      }
      break;
  }
});

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();

window.addEventListener("load", () => {
  loadUserData(); 
  audio.volume = userData.volume / 100;
  volumeSlider.value = userData.volume;
  updateVolumeIcon();
  updateRepeatButton();
});
// Modern Klavye Kısayol Sistemi
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.helpVisible = false;
    this.init();
  }

  init() {
    this.registerShortcuts();
    this.createHelpUI();
    this.setupEventListeners();
  }

  registerShortcuts() {
    // Media kontrol kısayolları
    this.shortcuts.set('Space', {
      action: () => this.togglePlayPause(),
      description: 'Çal/Durdur',
      category: 'Medya'
    });

    this.shortcuts.set('ArrowRight', {
      action: () => playNextSong(),
      description: 'Sonraki şarkı',
      category: 'Medya'
    });

    this.shortcuts.set('ArrowLeft', {
      action: () => playPreviousSong(),
      description: 'Önceki şarkı',
      category: 'Medya'
    });

    this.shortcuts.set('KeyM', {
      action: () => toggleMute(),
      description: 'Sesi aç/kapat',
      category: 'Ses'
    });

    this.shortcuts.set('BracketRight', {
      action: () => this.increaseVolume(),
      description: 'Sesi artır',
      category: 'Ses'
    });

    this.shortcuts.set('BracketLeft', {
      action: () => this.decreaseVolume(),
      description: 'Sesi azalt',
      category: 'Ses'
    });

    this.shortcuts.set('KeyS', {
      action: () => shuffle(),
      description: 'Karıştır',
      category: 'Çalma Listesi'
    });

    this.shortcuts.set('KeyR', {
      action: () => toggleRepeatMode(),
      description: 'Tekrar modu',
      category: 'Çalma Listesi'
    });

    this.shortcuts.set('KeyL', {
      action: () => toggleTheme(),
      description: 'Tema değiştir',
      category: 'Arayüz'
    });

    this.shortcuts.set('KeyH', {
      action: () => this.toggleHelp(),
      description: 'Yardım göster/gizle',
      category: 'Yardım'
    });

    this.shortcuts.set('Escape', {
      action: () => this.hideHelp(),
      description: 'Yardımı kapat',
      category: 'Yardım'
    });

    // Sayı tuşları için şarkı seçme
    for (let i = 0; i <= 9; i++) {
      this.shortcuts.set(`Digit${i}`, {
        action: () => this.selectSongByNumber(i),
        description: `Şarkı ${i} seç`,
        category: 'Hızlı Erişim'
      });
    }

    // Gelişmiş medya kontrolleri
    this.shortcuts.set('KeyF', {
      action: () => this.toggleFullscreen(),
      description: 'Tam ekran',
      category: 'Arayüz'
    });

    this.shortcuts.set('KeyJ', {
      action: () => this.seekBackward(),
      description: '10s geri sar',
      category: 'Medya'
    });

    this.shortcuts.set('KeyK', {
      action: () => this.togglePlayPause(),
      description: 'Çal/Durdur',
      category: 'Medya'
    });

    this.shortcuts.set('KeyL', {
      action: () => this.seekForward(),
      description: '10s ileri sar',
      category: 'Medya'
    });
  }

  // Gelişmiş fonksiyonlar
  togglePlayPause() {
    if (audio.paused) {
      if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
      } else {
        playSong(userData?.currentSong.id);
      }
    } else {
      pauseSong();
    }
  }

  increaseVolume() {
    volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
    updateVolume();
    this.showVolumeFeedback('+5%');
  }

  decreaseVolume() {
    volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
    updateVolume();
    this.showVolumeFeedback('-5%');
  }

  seekForward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    this.showSeekFeedback('+10s');
  }

  seekBackward() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    this.showSeekFeedback('-10s');
  }

  selectSongByNumber(number) {
    if (number < userData.songs.length) {
      playSong(userData.songs[number].id);
      this.showSongFeedback(userData.songs[number].title);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen hatası:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Geri bildirim sistemleri
  showVolumeFeedback(change) {
    this.showFeedback(`Ses: ${volumeSlider.value}% ${change}`);
  }

  showSeekFeedback(change) {
    this.showFeedback(`Sarılıyor: ${change}`);
  }

  showSongFeedback(title) {
    this.showFeedback(`Çalınıyor: ${title}`);
  }

  showFeedback(message) {
    // Mevcut feedback varsa kaldır
    const existingFeedback = document.getElementById('keyboard-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // Yeni feedback oluştur
    const feedback = document.createElement('div');
    feedback.id = 'keyboard-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--highlight-color);
      color: var(--background-color);
      padding: 10px 15px;
      border-radius: 5px;
      font-family: var(--font-family);
      font-size: 14px;
      z-index: 10000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(feedback);

    // Animasyon
    requestAnimationFrame(() => {
      feedback.style.opacity = '1';
      feedback.style.transform = 'translateY(0)';
    });

    // Otomatik kaldırma
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateY(-20px)';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  // Yardım UI'sı
  createHelpUI() {
    const helpDiv = document.createElement('div');
    helpDiv.id = 'keyboard-shortcuts-help';
    helpDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 20%;
      transform: translate(-50%, -50%) scale(0.9);
      background: var(--background-color);
      border: 2px solid var(--highlight-color);
      padding: 30px;
      border-radius: 15px;
      z-index: 10000;
      color: var(--primary-color);
      font-family: var(--font-family);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      opacity: 0;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      display: none;
    `;

    const categories = {};
    this.shortcuts.forEach((shortcut, key) => {
      if (!categories[shortcut.category]) {
        categories[shortcut.category] = [];
      }
      categories[shortcut.category].push({ key, ...shortcut });
    });

    let html = `
      <div style="display: flex; justify-content: between; align-items: left; margin-bottom: 20px;">
        <h3 style="margin: 0; color: var(--highlight-color); font-size: 1.5em;">
          🎹 Klavye Kısayolları
        </h3>
        <button onclick="keyboardShortcuts.hideHelp()" 
                style="background: none; border: none; color: var(--primary-color); cursor: pointer; font-size: 1.2em; padding: 5px;">
          ✕
        </button>
      </div>
    `;

    for (const [category, shortcuts] of Object.entries(categories)) {
      html += `
        <div style="margin-bottom: 25px;">
          <h4 style="margin: 0 0 10px 0; color: var(--highlight-color); font-size: 1.1em; border-bottom: 1px solid var(--foreground-color); padding-bottom: 5px;">
            ${category}
          </h4>
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; align-items: center;">
      `;

      shortcuts.forEach(shortcut => {
        const keyDisplay = this.formatKey(shortcut.key);
        html += `
          <div style="display: contents;">
            <kbd style="background: var(--foreground-color); padding: 4px 8px; border-radius: 4px; font-size: 0.9em; text-align: center;">
              ${keyDisplay}
            </kbd>
            <span>${shortcut.description}</span>
          </div>
        `;
      });

      html += `</div></div>`;
    }

    helpDiv.innerHTML = html;
    document.body.appendChild(helpDiv);
  }

  formatKey(key) {
    const keyMap = {
      'Space': 'Space',
      'ArrowRight': '→',
      'ArrowLeft': '←',
      'KeyM': 'M',
      'BracketRight': ']',
      'BracketLeft': '[',
      'KeyS': 'S',
      'KeyR': 'R',
      'KeyL': 'L',
      'KeyH': 'H',
      'Escape': 'Esc',
      'KeyF': 'F',
      'KeyJ': 'J',
      'KeyK': 'K',
      'KeyL': 'L'
    };

    // Sayı tuşları
    if (key.startsWith('Digit')) {
      return key.replace('Digit', '');
    }

    return keyMap[key] || key;
  }

  toggleHelp() {
    const helpDiv = document.getElementById('keyboard-shortcuts-help');
    if (this.helpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  showHelp() {
    const helpDiv = document.getElementById('keyboard-shortcuts-help');
    helpDiv.style.display = 'block';
    requestAnimationFrame(() => {
      helpDiv.style.opacity = '1';
      helpDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    this.helpVisible = true;
  }

  hideHelp() {
    const helpDiv = document.getElementById('keyboard-shortcuts-help');
    helpDiv.style.opacity = '0';
    helpDiv.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
      helpDiv.style.display = 'none';
    }, 300);
    this.helpVisible = false;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      // Input alanlarındayken kısayolları devre dışı bırak
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.isContentEditable) {
        return;
      }

      const shortcut = this.shortcuts.get(event.code);
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    });

    // ESC tuşu için global dinleyici
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape' && this.helpVisible) {
        this.hideHelp();
      }
    });

    // Help div'in dışına tıklayınca kapatma
    document.addEventListener('click', (event) => {
      const helpDiv = document.getElementById('keyboard-shortcuts-help');
      if (this.helpVisible && helpDiv && !helpDiv.contains(event.target)) {
        this.hideHelp();
      }
    });
  }
}

// KeyboardShortcuts instance'ını oluştur
const keyboardShortcuts = new KeyboardShortcuts();

// Sayfa yüklendiğinde kısayolları başlat
window.addEventListener('load', () => {
  // Kısayol bilgisi
  console.log('🎹 Modern klavye kısayolları yüklendi!');
  console.log('H tuşuna basarak yardımı görüntüleyebilirsiniz.');
  
  loadUserData();
  audio.volume = userData.volume / 100;
  volumeSlider.value = userData.volume;
  updateVolumeIcon();
  updateRepeatButton();
});
