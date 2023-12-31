import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Alert } from 'antd';
import { RecordedSessions } from './RecordedSessions';
import { Record } from './Record';
import { UploadFiles } from './Upload';
import {User} from "./login/User";
import { getTranscript } from './transcriptGetter'

interface Props {
  user: User;
}

export const RecordingPage: React.FC<Props> = ({user}) => {
  const [capturing, setCapturing] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [sessions, setSessions] = useState<string[]>([]);

  const addSession = (url: string) => {
    console.log("A new session has been recorded", url)
    setSessions(prev => [...prev, url]);
  };

  const toggleRecordingMode = () => {
    setRecordingAudio(!recordingAudio);
  }
  useEffect(() => {
    return () => {
        sessions.forEach(URL.revokeObjectURL);
    };
}, []);

  return (
    <div className="container">
      <Record 
        capturing={capturing}
        setCapturing={setCapturing}
        recordingAudio={recordingAudio}
        toggleRecordingMode={toggleRecordingMode}
        addSession={addSession}
      />
      <UploadFiles 
        addSession={addSession}
      />
      <RecordedSessions sessions={sessions} recordingAudio={recordingAudio} onButtonClick={getTranscript}/>
    </div>
  );
};
