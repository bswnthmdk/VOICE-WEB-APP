import { useState, useRef } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // countdown state
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          deviceId: undefined,
          sampleRate: 44100,
          channelCount: 2,
          echoCancellation: true,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setTimeLeft(10); // reset timer to 10 seconds

      // Auto-stop after 10 seconds
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, 10000);

      // Countdown display
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Recording process error:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearTimeout(timerRef.current);
      clearInterval(countdownIntervalRef.current);
    }
  };

  const uploadRecording = async () => {
    if (!audioUrl) {
      alert("No recording to upload");
      return;
    }
    try {
      const blob = await fetch(audioUrl).then((res) => res.blob());

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      // Replace this URL with your backend route
      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }
  };

  return (
    <div className="audio-recorder">
      {/* Show Recording text at the top */}
      {recording && <p>Recording...</p>}

      <div className="button-row">
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>

      <div className="button-row">
        <button onClick={uploadRecording} disabled={!audioUrl}>
          Upload
        </button>
      </div>

      {/* Show timer below buttons */}
      {recording && <p>Time left: {timeLeft}s</p>}

      {audioUrl && <audio controls src={audioUrl}></audio>}
    </div>
  );
}
