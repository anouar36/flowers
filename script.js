onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
  
  // Initialize sound effects
  initializeSounds();
  
  // Add floating particles effect
  createFloatingParticles();
  
  // Add click heart effect
  addClickHeartEffect();
};

// Sound effects initialization
function initializeSounds() {
  // Create audio elements for sound effects
  window.sounds = {
    backgroundMusic: null,
    voiceMessage: null,
    isPlaying: false,
    isVoicePlaying: false
  };
  
  // Initialize audio elements
  initAudioElements();
  
  // Add background music toggle button
  addMusicControls();
  
  // Add voice message feature
  initializeVoiceMessage();
}

function initAudioContext() {
  try {
    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createSounds();
    playAmbientSound();
  } catch (error) {
    console.log('Audio not supported in this browser');
  }
}

function createSounds() {
  if (!window.audioContext) return;
  
  // Create heart click sound effect
  window.sounds.heartClick = createHeartClickSound();
  
  // Create ambient romantic sound
  window.sounds.ambient = createAmbientSound();
}

function createHeartClickSound() {
  // Create a sweet bell-like sound for heart clicks
  return function() {
    if (!window.audioContext) return;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    // Sweet bell sound
    oscillator.frequency.setValueAtTime(880, window.audioContext.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1320, window.audioContext.currentTime + 0.1); // E6
    oscillator.frequency.exponentialRampToValueAtTime(660, window.audioContext.currentTime + 0.3); // E5
    
    gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(window.audioContext.currentTime + 0.5);
  };
}

function createAmbientSound() {
  if (!window.audioContext) return null;
  
  // Create ambient romantic atmosphere
  const oscillator1 = window.audioContext.createOscillator();
  const oscillator2 = window.audioContext.createOscillator();
  const oscillator3 = window.audioContext.createOscillator();
  
  const gainNode1 = window.audioContext.createGain();
  const gainNode2 = window.audioContext.createGain();
  const gainNode3 = window.audioContext.createGain();
  const masterGain = window.audioContext.createGain();
  
  // Romantic chord progression (C major - soft and warm)
  oscillator1.frequency.setValueAtTime(261.63, window.audioContext.currentTime); // C4
  oscillator2.frequency.setValueAtTime(329.63, window.audioContext.currentTime); // E4
  oscillator3.frequency.setValueAtTime(392.00, window.audioContext.currentTime); // G4
  
  oscillator1.type = 'sine';
  oscillator2.type = 'sine';
  oscillator3.type = 'triangle';
  
  oscillator1.connect(gainNode1);
  oscillator2.connect(gainNode2);
  oscillator3.connect(gainNode3);
  
  gainNode1.connect(masterGain);
  gainNode2.connect(masterGain);
  gainNode3.connect(masterGain);
  masterGain.connect(window.audioContext.destination);
  
  // Very soft ambient volume
  gainNode1.gain.setValueAtTime(0.02, window.audioContext.currentTime);
  gainNode2.gain.setValueAtTime(0.015, window.audioContext.currentTime);
  gainNode3.gain.setValueAtTime(0.01, window.audioContext.currentTime);
  masterGain.gain.setValueAtTime(0.3, window.audioContext.currentTime);
  
  return {
    oscillators: [oscillator1, oscillator2, oscillator3],
    masterGain: masterGain,
    start: function() {
      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
      window.sounds.isPlaying = true;
    },
    stop: function() {
      try {
        oscillator1.stop();
        oscillator2.stop();
        oscillator3.stop();
        window.sounds.isPlaying = false;
      } catch (e) {
        // Oscillators already stopped
      }
    }
  };
}

function playAmbientSound() {
  if (window.sounds.ambient && !window.sounds.isPlaying) {
    window.sounds.ambient.start();
  }
}

function stopAmbientSound() {
  if (window.sounds.ambient && window.sounds.isPlaying) {
    window.sounds.ambient.stop();
    // Recreate ambient sound for next play
    setTimeout(() => {
      if (window.audioContext) {
        window.sounds.ambient = createAmbientSound();
      }
    }, 100);
  }
}

function playHeartSound() {
  if (window.sounds.heartClick) {
    window.sounds.heartClick();
  }
}

function initAudioElements() {
  // Initialize background music
  window.sounds.backgroundMusic = new Audio('../Cinematic Documentary Background Music - by AShamaluevMusic.mp3');
  window.sounds.backgroundMusic.loop = true;
  window.sounds.backgroundMusic.volume = 0.3;
  
  // Initialize voice message
  window.sounds.voiceMessage = new Audio('../ElevenLabs_2025-11-10T15_50_27_Grandpa Spuds Oxley_pvc_sp88_s37_sb75_f2-5.mp3');
  window.sounds.voiceMessage.volume = 0.8;
  
  // Handle loading errors
  window.sounds.backgroundMusic.addEventListener('error', function() {
    console.log('Background music file not found');
  });
  
  window.sounds.voiceMessage.addEventListener('error', function() {
    console.log('Voice message file not found');
  });
}

function playBackgroundMusic() {
  if (window.sounds.backgroundMusic && !window.sounds.isPlaying) {
    window.sounds.backgroundMusic.play().then(() => {
      window.sounds.isPlaying = true;
    }).catch(error => {
      console.log('Could not play background music:', error);
    });
  }
}

function stopBackgroundMusic() {
  if (window.sounds.backgroundMusic && window.sounds.isPlaying) {
    window.sounds.backgroundMusic.pause();
    window.sounds.backgroundMusic.currentTime = 0;
    window.sounds.isPlaying = false;
  }
}

function addMusicControls() {
  const musicButton = document.createElement('button');
  musicButton.innerHTML = '🎵';
  musicButton.className = 'music-control';
  musicButton.title = 'Toggle Background Music';
  
  musicButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #ff0080;
    font-size: 20px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  musicButton.addEventListener('click', function() {
    if (window.sounds.isPlaying) {
      stopBackgroundMusic();
      musicButton.innerHTML = '🔇';
      musicButton.style.color = '#666';
    } else {
      playBackgroundMusic();
      musicButton.innerHTML = '🎵';
      musicButton.style.color = '#ff0080';
    }
  });
  
  musicButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 0 20px rgba(255, 0, 128, 0.5)';
  });
  
  musicButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
  });
  
  document.body.appendChild(musicButton);
}

function initializeVoiceMessage() {
  // Create voice message button
  const voiceButton = document.createElement('button');
  voiceButton.innerHTML = '💬';
  voiceButton.className = 'voice-control';
  voiceButton.title = 'Play Love Message';
  
  voiceButton.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #ff0080;
    font-size: 20px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  voiceButton.addEventListener('click', function() {
    playLoveMessage();
  });
  
  voiceButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 0 20px rgba(255, 0, 128, 0.5)';
  });
  
  voiceButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
  });
  
  document.body.appendChild(voiceButton);
}

function playLoveMessage() {
  // Stop any current voice message
  if (window.sounds.voiceMessage && !window.sounds.voiceMessage.paused) {
    window.sounds.voiceMessage.pause();
    window.sounds.voiceMessage.currentTime = 0;
    hideSpeakingEffect();
  }
  
  // Play the ElevenLabs voice message
  if (window.sounds.voiceMessage) {
    // Show speaking effect
    showSpeakingEffect();
    
    // Play the audio file
    window.sounds.voiceMessage.play().then(() => {
      console.log('Voice message started playing');
      window.sounds.isVoicePlaying = true;
    }).catch(error => {
      console.log('Could not play voice message:', error);
      hideSpeakingEffect();
    });
    
    // Add event listener for when the audio ends
    window.sounds.voiceMessage.addEventListener('ended', function() {
      hideSpeakingEffect();
      window.sounds.isVoicePlaying = false;
    }, { once: true });
  }
}

function showSpeakingEffect() {
  // Add a speaking indicator to the romantic text
  const romanticText = document.querySelector('.romantic-text');
  if (romanticText) {
    romanticText.style.animation = 'speaking-glow 1s ease-in-out infinite';
  }
  
  // Change voice button to indicate speaking
  const voiceButton = document.querySelector('.voice-control');
  if (voiceButton) {
    voiceButton.innerHTML = '🗣️';
    voiceButton.style.color = '#00ff80';
  }
}

function hideSpeakingEffect() {
  // Remove speaking indicator
  const romanticText = document.querySelector('.romantic-text');
  if (romanticText) {
    romanticText.style.animation = '';
  }
  
  // Reset voice button
  const voiceButton = document.querySelector('.voice-control');
  if (voiceButton) {
    voiceButton.innerHTML = '💬';
    voiceButton.style.color = '#ff0080';
  }
}

function createFloatingParticles() {
  const container = document.body;
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.innerHTML = '✨';
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 50;
        font-size: ${Math.random() * 10 + 10}px;
        color: hsl(${Math.random() * 360}, 80%, 60%);
        left: ${Math.random() * 100}vw;
        top: 100vh;
        text-shadow: 0 0 10px currentColor;
        animation: float-up ${Math.random() * 10 + 15}s linear infinite;
      `;
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, (Math.random() * 10 + 15) * 1000);
    }, i * 2000);
  }
  
  // Repeat the effect
  setTimeout(createFloatingParticles, 30000);
}

function addClickHeartEffect() {
  document.addEventListener('click', function(e) {
    createHeart(e.clientX, e.clientY);
    playHeartSound();
  });
  
  // Also add touch support for mobile devices
  document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    createHeart(touch.clientX, touch.clientY);
    playHeartSound();
  });
}

function createHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'click-heart';
  
  // Random heart styles
  const heartSymbols = ['💖', '💕', '💗', '💓', '💝', '💘', '❤️', '💜', '💙', '💚'];
  const randomHeart = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.innerHTML = randomHeart;
  
  // Position the heart at click location
  heart.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${Math.random() * 20 + 20}px;
    pointer-events: none;
    z-index: 1000;
    transform: translate(-50%, -50%);
    animation: heartFloat 2s ease-out forwards;
    text-shadow: 0 0 10px rgba(255, 182, 193, 0.8);
  `;
  
  document.body.appendChild(heart);
  
  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, 2000);
}
