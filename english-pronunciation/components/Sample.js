"use client"

import { useEffect, useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Volume2, Mic, Play, StopCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "../style.module.css";
import { storage } from '@/config/firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Suspense } from 'react'
import Result from './Result';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const sdk = require('microsoft-cognitiveservices-speech-sdk')

export default function Sample() {
  const [samples, setSample] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [result, setResult] = useState(null);
  const [pronunciation, setPronunciation] = useState("");
  const audioRef = useRef(null);
  const recorderRef = useRef(null);
  const supabase = createClientComponentClient()


  useEffect(() => {
    async function getSamples() {
      const { data } = await supabase.from('sample').select();
      setSample(data)
    }
    getSamples();
  }, []);

  useEffect(() => {
    async function getIPAPronunciation() {
      if (samples.length > 0) {
        const response = await fetch('/pronunciation', {
          method: 'POST',
          body: JSON.stringify({ sentence: samples[currentIndex]?.content })
        });
        const data = await response.json();
        setPronunciation(data)
      }
    };

    async function getResultHistory() {
      if (samples.length > 0) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('results')
          .select()
          .eq('email', user.email)
          .eq('sample_id', currentIndex + 1)
          .order('created_time', { ascending: false })
          .limit(1)
        if (data.length > 0) {
          setAudioURL(data[0].audiourl);
          setResult(JSON.parse(data[0].result));
        }

      }
    }
    getIPAPronunciation();
    getResultHistory();
  }, [samples, currentIndex])

  const handlePlayback = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.finishRecording();
      setRecording(false);
    }
  };

  const handleRecord = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const recorder = new WebAudioRecorder(sourceNode, {
      workerDir: "/WebAudioRecorder/",
      encoding: "wav",
    });
    setResult(null)
    recorderRef.current = recorder;
    recorder.onComplete = async function (rec, blob) {
      const filename = `audio/record_${new Date().toISOString()}.wav`;
      const audioRef = ref(storage, filename);
      try {
        const snapshot = await uploadBytes(audioRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setAudioURL(downloadURL);
        const response = await fetch('/assessment', {
          method: 'POST',
          body: JSON.stringify({ blobName: filename, text: samples[currentIndex]?.content })
        });
        const data = await response.json();
        setResult(data)
      } catch (error) {
        console.error(error);
      }
    }

    recorder.startRecording();
    setRecording(true);
  }

  const handleAudio = async () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION);
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(
      samples[currentIndex].content,
      result => {
        if (result) {
          synthesizer.close();
          return result.audioData;
        }
      },
      error => {
        console.log(error);
        synthesizer.close();
      });
  };

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from('results').insert({
      email: user.email,
      sample_id: currentIndex + 1,
      audiourl: audioURL,
      result: JSON.stringify(result)
    });
  };

  return (
    <>
      <div className={`w-full max-w-6xl p-8 bg-gray-100 rounded-lg space-y-8 ${styles.sampleArea}`}>
        <div className={styles.contentBox}>
          <div className={styles.volumeContainer}>
            <Dialog>
              <DialogTrigger asChild>
                <Save style={{ cursor: "pointer", color: "#2c2c54", marginRight: "10px" }}  />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogDescription>
                    Do you want to save this pronunciation assessment?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" className={styles.button} onClick={save}>Save</Button>
                  </DialogClose>
                </DialogFooter>

              </DialogContent>
            </Dialog>
            <Volume2 style={{ cursor: "pointer", color: "#2c2c54" }} onClick={handleAudio} />
          </div>
          <Suspense fallback={<p>Loading samples...</p>}>
            <div className='flex text-center'>
              <h1 style={{ color: "#2c2c54", fontSize: "21px" }}>
                {samples[currentIndex]?.content}
              </h1>
            </div>
            <div className='flex text-center'>
              <h1 style={{ color: "#2c2c54", fontSize: "16px" }}>
                /{pronunciation}/
              </h1>
            </div>
          </Suspense>
          <div className={styles.buttonContainer}>
            {
              recording ?
                <Button className={styles.button} style={{ background: "rgb(255, 99, 71)" }} onClick={stopRecording} >
                  <StopCircle className="mr-2 h-4 w-4 animate-spin" /> Stop recording
                </Button> :
                <Button className={styles.button} onClick={handleRecord}>
                  <Mic className="mr-2 h-4 w-4" /> Record
                </Button>
            }
            {<Button className={styles.button} disabled={recording || !audioURL} onClick={handlePlayback}>
              <Play className="mr-2 h-4 w-4" /> Listen
            </Button>}
            <audio ref={audioRef} src={audioURL} style={{ display: 'none' }}></audio>
          </div>
        </div>
        <Suspense fallback={<p>Loading result...</p>}>
          {result && <Result result={result} />}
        </Suspense>

        <div className="flex justify-center">
          <Button variant="outline" size="icon" className={styles.button} onClick={() => {
            currentIndex !== 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(samples.length - 1);
            setResult(null);
            setAudioURL('');
          }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className=" grid place-items-center mx-3">{(currentIndex + 1)}/{samples.length}</div>
          <Button variant="outline" className={styles.button} size="icon" onClick={() => {
            currentIndex !== samples.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
            setResult(null);
            setAudioURL('');
          }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>

  )

}