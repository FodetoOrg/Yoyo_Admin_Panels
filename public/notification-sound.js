// Notification Sound Utility
// This file provides a simple way to play notification sounds

export function playNotificationSound() {
  try {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a big notification sound (very loud and longer)
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1400, audioContext.currentTime + 0.4);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.6);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.8);
    
    // Very high volume (0.8) and longer duration (1.0 seconds)
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.0);
    
    return true;
  } catch (error) {
    console.log('Could not play notification sound:', error);
    return false;
  }
}

// Alternative method using HTML5 Audio (if Web Audio API fails)
export function playNotificationSoundFallback() {
  try {
    // Create a louder beep using HTML5 Audio
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    audio.volume = 0.9; // Increased volume to 0.9 for big sound
    audio.play();
    return true;
  } catch (error) {
    console.log('Could not play fallback notification sound:', error);
    return false;
  }
}

// Main function that tries both methods
export function playNotificationSoundWithFallback() {
  // Try Web Audio API first
  if (!playNotificationSound()) {
    // Fallback to HTML5 Audio
    playNotificationSoundFallback();
  }
}
