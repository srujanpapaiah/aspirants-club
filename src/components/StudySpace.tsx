import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const environments = [
  { name: 'Forest', video: '/videos/forest.mp4', audio: '/sounds/forest.mp3' },
  { name: 'Waves', video: '/videos/waves.mp4', audio: '/sounds/waves.mp3' },
  { name: 'Rainy Day', video: '/videos/rain.mp4', audio: '/sounds/rain.mp3' },
  { name: 'Fireplace', video: '/videos/fireplace.mp4', audio: '/sounds/fireplace.mp3' },
];

const ZenStudySpace: React.FC = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState(environments[0]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const changeEnvironment = (env: typeof environments[0]) => {
    setCurrentEnvironment(env);
    if (videoRef.current) {
      videoRef.current.src = env.video;
      videoRef.current.load();
      videoRef.current.play().catch(error => console.error("Video playback failed:", error));
    }
    if (audioRef.current) {
      audioRef.current.src = env.audio;
      audioRef.current.load();
      audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, isBreak]);

  useEffect(() => {
    const startMediaPlayback = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => console.error("Video autoplay failed:", error));
      }
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Audio autoplay failed:", error));
      }
    };

    document.addEventListener('click', startMediaPlayback, { once: true });
    return () => {
      document.removeEventListener('click', startMediaPlayback);
    };
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={currentEnvironment.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Minimal Header with Larger Logo */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <div className="flex items-center">
          <span className="text-white font-bold text-2xl">Aspirants Club</span>
        </div>
        <UserButton />
      </div>
      
      {/* Timer Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 rounded-lg p-4 text-center">
        <div className="text-lg font-semibold text-white mb-2">
          {isBreak ? 'Break Time' : 'Study Time'}
        </div>
        <div className="text-4xl font-bold text-white">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-300 mt-2">
          {isBreak ? 'Relax and recharge' : 'Stay focused and productive'}
        </div>
      </div>

      {/* Back Button with Text - Bottom Left */}
      <Link href="/" className="absolute bottom-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out z-20 flex items-center">
        <ArrowLeft size={24} className="mr-2" />
        <span>Go Back</span>
      </Link>


      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 bg-gradient-to-t from-black to-transparent">
        <div className="flex flex-col items-center justify-between max-w-4xl mx-auto space-y-4 p-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTimer}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition duration-300 ease-in-out"
              title={isTimerRunning ? "Pause Timer" : "Start Timer"}
            >
              {isTimerRunning ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition duration-300 ease-in-out"
              title="Reset Timer"
            >
              <RotateCcw size={32} />
            </button>
            <button
              onClick={toggleMute}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition duration-300 ease-in-out"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto w-full justify-center">
            {environments.map((env) => (
              <button
                key={env.name}
                onClick={() => changeEnvironment(env)}
                className={`px-4 py-2 rounded-full text-sm ${
                  currentEnvironment.name === env.name 
                    ? 'bg-white text-black' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                } transition duration-300 ease-in-out whitespace-nowrap`}
              >
                {env.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} loop>
        <source src={currentEnvironment.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default ZenStudySpace;