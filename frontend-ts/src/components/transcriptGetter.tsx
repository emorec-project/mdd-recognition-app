import axios from 'axios';
import React from 'react';
import TEditor from './transcriptEditor/TranscriptEditor';
import DEMO_TRANSCRIPT from "../data/transcriptExampleData.json"
const DEMO_TITLE ="TED Talk | Kate Darling - Why we have an emotional connection to robots"
const DEMO_MEDIA_URL = "https://download.ted.com/talks/KateDarling_2018S-950k.mp4"


export const getTranscript = (sessionId: string) => {
    //TODO: sessionId is not file name! Need to fix this!
    //`http://localhost:8000/get_video_by_id/${sessionId}`
    // const transcript_response = await axios.get(`http://localhost:8000/get_transcript_by_id/fb04aea7-8b8e-4d59-ad04-9e92b4691b8d.mp4`, {
    //     headers: {
    //         'Accept': 'application/json'
    //     }
    // });
    // console.log(transcript_response)
    // sessionId = '8e57aa39-d7cf-40cf-ab6f-2d8dcbd58b15'
    const videoUrl = `http://localhost:8000/get_video_by_id/${sessionId}.mp4`
    return (
       <TEditor transcriptJson={DEMO_TRANSCRIPT} videoLink={videoUrl} videoTitle={sessionId}/>
       //TODO: change to this:
       //        <TEditor transcriptJson={transcript_response} videoLink={videoUrl} videoTitle={sessionId}/>

      );
    // return response;
}
