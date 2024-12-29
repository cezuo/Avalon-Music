import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      min: 0,
    },
    totalTime: {
      second: 0,
      min: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = (id) => {
    setTrack(songsData[id]);
    audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]); // Corrected from `track.id - 1`
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

    const seekSong = async (e) => {
      audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (audioRef.current.duration) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        seekBar.current.style.width = progress + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            min: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            min: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    audioRef.current.ontimeupdate = updateProgress;

    return () => {
      audioRef.current.ontimeupdate = null;
    };
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

