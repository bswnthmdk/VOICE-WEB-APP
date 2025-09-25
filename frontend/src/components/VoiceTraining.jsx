// frontend/src/components/VoiceTraining.jsx - FIXED VERSION

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, MicOff, Check, RotateCcw, Brain } from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  dismiss,
} from "@/lib/toast";

export default function VoiceTraining({ user, onClose }) {
  const TOTAL_SENTENCES = 5;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  // Voice recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentRecordingRef = useRef(null);

  // Voice training states
  const [showVoiceTraining, setShowVoiceTraining] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  // Multi-stage flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedAudioBlobs, setRecordedAudioBlobs] = useState([]); // Store actual audio blobs
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);

  // Sample sentences for voice training
  const trainingSentences = [
    "Open the door",
    "Access granted now",
    "Security check complete",
    "Voice authentication ready",
    "System unlock confirmed",
  ];

  // Initialize media recorder
  const initializeMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        currentRecordingRef.current = audioBlob;
        setHasRecording(true);

        // Stop all tracks to free up microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      return mediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      showError("Could not access microphone. Please check permissions.");
      return null;
    }
  };

  const startRecording = async () => {
    const mediaRecorder = await initializeMediaRecorder();
    if (!mediaRecorder) return;

    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setHasRecording(false);
    setRecordingTime(0);

    mediaRecorder.start();

    // Start timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 10) {
          clearInterval(timer);
          stopRecording();
          return 10;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const submitRecording = async () => {
    if (
      isSubmitting ||
      recordedAudioBlobs.length === TOTAL_SENTENCES ||
      !currentRecordingRef.current
    ) {
      return;
    }

    const expectedSentence = trainingSentences[recordedAudioBlobs.length];
    const loadingToast = showLoading("Validating voice...");
    setIsSubmitting(true);

    try {
      // For demo: simulate transcription validation
      // In production, you'd send the audio to a speech-to-text service
      const isMatch = Math.random() > 0.3; // 70% success rate for demo

      await new Promise((resolve) => setTimeout(resolve, 1500));

      dismiss(loadingToast);

      if (isMatch) {
        showSuccess(
          `✅ Voice Matched for Sentence ${recordedAudioBlobs.length + 1}!`
        );

        // Store the actual audio blob
        setRecordedAudioBlobs((prev) => [...prev, currentRecordingRef.current]);
        currentRecordingRef.current = null;

        if (recordedAudioBlobs.length + 1 < TOTAL_SENTENCES) {
          setHasRecording(false);
        }
      } else {
        showError(`❌ Voice Mismatch. Please try again.`);
        setHasRecording(false);
      }
    } catch (error) {
      dismiss(loadingToast);
      showError(`Submission failed: ${error.message}`);
      setHasRecording(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadVoices = async () => {
    if (isSubmitting || recordedAudioBlobs.length !== TOTAL_SENTENCES) return;

    const uploadToast = showLoading("Uploading audio files to Cloudinary...");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const uploadPromises = recordedAudioBlobs.map(
        async (audioBlob, index) => {
          const formData = new FormData();

          // Convert blob to file with proper name
          const audioFile = new File(
            [audioBlob],
            `voice_sample_${index + 1}.webm`,
            {
              type: "audio/webm",
            }
          );

          formData.append("audio", audioFile);
          formData.append("ownerName", user?.username || "unknown");

          const response = await fetch(
            `${API_BASE_URL}/voice-web-app/api/audio/upload-audio`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Upload failed for sample ${index + 1}`
            );
          }

          const result = await response.json();
          return result;
        }
      );

      const uploadResults = await Promise.all(uploadPromises);

      const failedUploads = uploadResults.filter((res) => !res.success);
      if (failedUploads.length > 0) {
        throw new Error(`${failedUploads.length} files failed to upload.`);
      }

      const urls = uploadResults.map((res) => res.url);
      setCloudinaryUrls(urls);
      setIsUploadComplete(true);

      dismiss(uploadToast);
      showSuccess("All voice samples uploaded successfully! 🎉");
    } catch (error) {
      dismiss(uploadToast);
      showError(`Upload failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrainModel = async () => {
    if (isSubmitting || !isUploadComplete || isModelTrained) return;

    const trainingToast = showLoading("Training voice model...");
    setIsSubmitting(true);

    try {
      const username = user?.username || "sample";
      const externalApiUrl = `https://voice-recognition-api.onrender.com/api/v1/test_user?username=${username}`;

      const response = await fetch(externalApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cloudinaryUrls),
      });

      const data = await response.json();
      dismiss(trainingToast);

      if (!response.ok) {
        console.error("External API training failed:", data);
        showError(data.message || "Model training failed in external API.");
        throw new Error("Model training failed.");
      }

      setIsModelTrained(true);
      showSuccess("Voice model trained successfully! 🎉");
    } catch (error) {
      dismiss(trainingToast);
      showError(error.message || "Failed to train voice model.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVoiceTraining = () => {
    setRecordedAudioBlobs([]);
    setCloudinaryUrls([]);
    setIsUploadComplete(false);
    setIsModelTrained(false);
    setHasRecording(false);
    setIsRecording(false);
    setRecordingTime(0);
    currentRecordingRef.current = null;
    showInfo("Voice training progress reset.");
  };

  const handleCloseTraining = () => {
    setShowVoiceTraining(false);
  };

  // Button logic
  const isAllRecorded = recordedAudioBlobs.length === TOTAL_SENTENCES;
  let mainButtonAction = startRecording;
  let mainButtonText = "Start Voice Training";
  let mainButtonIcon = <Mic className="w-5 h-5 mr-2" />;

  if (isModelTrained) {
    mainButtonAction = handleCloseTraining;
    mainButtonText = "Training Complete! Close";
    mainButtonIcon = <Check className="w-5 h-5 mr-2" />;
  } else if (isAllRecorded) {
    if (!isUploadComplete) {
      mainButtonAction = handleUploadVoices;
      mainButtonText = isSubmitting ? "Uploading..." : "Upload Voices";
      mainButtonIcon = <Brain className="w-5 h-5 mr-2" />;
    } else {
      mainButtonAction = handleTrainModel;
      mainButtonText = isSubmitting ? "Training..." : "Train Model";
      mainButtonIcon = <Brain className="w-5 h-5 mr-2" />;
    }
  }

  return (
    <>
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Voice Model Training
          </CardTitle>
          <CardDescription>
            Train your personal voice model for enhanced authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Training Process:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Record {TOTAL_SENTENCES} different sentences clearly</li>
              <li>• Each recording has a 10-second limit</li>
              <li>• Voice validation happens in real-time</li>
              <li>• Complete all sentences to train your model</li>
            </ul>
          </div>

          <Button
            onClick={() => setShowVoiceTraining(true)}
            className="w-full"
            size="lg"
            disabled={isModelTrained}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isModelTrained ? "Training Complete" : "Start Voice Training"}
          </Button>

          {recordedAudioBlobs.length > 0 && !isModelTrained && (
            <div className="text-center">
              <p className="text-sm font-medium text-primary">
                Progress: {recordedAudioBlobs.length}/{TOTAL_SENTENCES}{" "}
                sentences recorded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Dialog */}
      <Dialog open={showVoiceTraining} onOpenChange={setShowVoiceTraining}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {isModelTrained ? "Training Complete" : "Voice Model Training"}
            </DialogTitle>
            <DialogDescription>
              {isModelTrained
                ? "Your voice model is ready for authentication."
                : `Complete all ${TOTAL_SENTENCES} sentences to train your model`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">
                  {recordedAudioBlobs.length}/{TOTAL_SENTENCES} completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${
                      (recordedAudioBlobs.length / TOTAL_SENTENCES) * 100
                    }%`,
                  }}
                >
                  {recordedAudioBlobs.length > 0 && (
                    <span className="text-xs text-primary-foreground font-medium">
                      {Math.round(
                        (recordedAudioBlobs.length / TOTAL_SENTENCES) * 100
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            {isModelTrained ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-600">
                        Training Complete! 🎉
                      </h3>
                      <p className="text-muted-foreground">
                        Your voice model is ready.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Current Sentence */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-lg">
                      Sentence {recordedAudioBlobs.length + 1} of{" "}
                      {TOTAL_SENTENCES}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-2xl font-bold p-4 bg-background/50 rounded-lg border-2 border-dashed">
                        "{trainingSentences[recordedAudioBlobs.length]}"
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isAllRecorded
                          ? "All sentences recorded. Ready to upload!"
                          : "Click record and speak clearly"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recording Controls */}
                {!isAllRecorded && (
                  <div className="text-center space-y-4">
                    {!isRecording && !hasRecording && (
                      <Button
                        onClick={startRecording}
                        size="lg"
                        disabled={isSubmitting}
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    )}

                    {isRecording && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-lg font-medium">
                            Recording... {recordingTime}s / 10s
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${(recordingTime / 10) * 100}%` }}
                          />
                        </div>
                        <Button
                          onClick={stopRecording}
                          variant="secondary"
                          size="lg"
                        >
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    )}

                    {hasRecording && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span>Recording completed</span>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={submitRecording}
                            size="lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Validating..." : "Submit"}
                          </Button>
                          <Button
                            onClick={() => setHasRecording(false)}
                            variant="outline"
                            size="lg"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Re-record
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Completed Sentences */}
            {recordedAudioBlobs.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-green-600">
                    ✓ Recorded Sentences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recordedAudioBlobs.map((blob, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm bg-green-50 p-2 rounded"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="font-medium">#{index + 1}:</span>
                        <span>"{trainingSentences[index]}"</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 border-t">
              {isAllRecorded && !isModelTrained && (
                <Button
                  onClick={mainButtonAction}
                  className="flex-1"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {mainButtonIcon}
                  {mainButtonText}
                </Button>
              )}

              {recordedAudioBlobs.length > 0 && !isModelTrained && (
                <Button
                  variant="outline"
                  onClick={resetVoiceTraining}
                  disabled={isSubmitting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}

              <Button variant="outline" onClick={handleCloseTraining}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
