// Speech-to-Text using Web Speech API
export class SpeechRecognition {
  private recognition: any;
  private isListening = false;

  constructor(onResult: (text: string) => void, onError?: (error: string) => void) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (onError) onError(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  getIsListening() {
    return this.isListening;
  }
}

// Text-to-Speech using OpenAI API
export class TextToSpeech {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
    }
  }

  async speak(text: string, useOpenAI = false): Promise<void> {
    if (useOpenAI) {
      await this.speakWithOpenAI(text);
    } else {
      await this.speakWithBrowser(text);
    }
  }

  private async speakWithOpenAI(text: string): Promise<void> {
    try {
      // Call our backend to generate speech using OpenAI
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      this.isPlaying = true;
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          this.isPlaying = false;
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = () => {
          this.isPlaying = false;
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('OpenAI TTS error, falling back to browser TTS:', error);
      await this.speakWithBrowser(text);
    }
  }

  private async speakWithBrowser(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to find a natural voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Natural') || 
          voice.name.includes('Neural') || 
          voice.default
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        this.isPlaying = true;
        
        utterance.onend = () => {
          this.isPlaying = false;
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.isPlaying = false;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        speechSynthesis.speak(utterance);
      } else {
        reject(new Error('Speech synthesis not supported'));
      }
    });
  }

  stop() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }
}