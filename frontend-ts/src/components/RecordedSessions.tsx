import React from 'react';
import { Collapse } from 'antd';

interface RecordedSessionsProps {
  sessions: string[];
  recordingAudio: boolean;
  onButtonClick;
}

export const RecordedSessions: React.FC<RecordedSessionsProps> = ({ sessions, recordingAudio, onButtonClick }) => {
  return (
    <div className='sessionsContainer'>
      <Collapse>
        <Collapse.Panel header={`Recorded Sessions (${sessions.length})`} key="1">
          {sessions.map((session, index) => (
            <div key={index}>
              {recordingAudio ? 
                <audio preload="none" src={session} controls></audio> : 
                <video preload="none" src={session} controls></video>
              }
              <button onClick={() => onButtonClick(session)}>Get Doc</button>
            </div>
          ))}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
