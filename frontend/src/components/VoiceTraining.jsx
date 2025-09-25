// frontend/src/components/VoiceTraining.jsx

import { useState } from "react";
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

// The component now accepts 'user' prop
export default function VoiceTraining({ user, onClose }) {
  const TOTAL_SENTENCES = 5;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  // Voice training states
  const [showVoiceTraining, setShowVoiceTraining] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  // New states for multi-stage flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedAudioIds, setRecordedAudioIds] = useState([]); // Stores simulated audio IDs for successful recordings
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]); // Stores Cloudinary URLs after upload
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

  // Helper to simulate UUID for a local audio file
  const generateSimulatedAudioId = () => {
    return `local_audio_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}.wav`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecording(false);
    setRecordingTime(0);

    // Simulate recording with timer
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
    setIsRecording(false);
    setHasRecording(true);
    setRecordingTime(0);
  };

  const submitRecording = async () => {
    // Current sentence is determined by the number of successful recordings
    if (isSubmitting || recordedAudioIds.length === TOTAL_SENTENCES) return;

    const expectedSentence = trainingSentences[recordedAudioIds.length];
    const loadingToast = showLoading("Transcribing and validating voice...");
    setIsSubmitting(true);

    try {
      // 1. Simulate Audio Upload and Transcription
      // For demo, simulate a 70% success rate with transcription matching the sentence exactly.
      const isPerfectMatch = Math.random() > 0.3;
      const mockTranscription = isPerfectMatch
        ? expectedSentence
        : Math.random() > 0.5
        ? "Open the door now"
        : "Wrong phrase spoken";

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Clean text for comparison (ignore case and punctuation)
      const cleanText = (text) =>
        text
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .trim();
      const cleanedExpected = cleanText(expectedSentence);
      const cleanedTranscription = cleanText(mockTranscription);

      const isMatch = cleanedTranscription === cleanedExpected;

      dismiss(loadingToast);

      if (isMatch) {
        showSuccess(
          `✅ Voice Matched for Sentence ${recordedAudioIds.length + 1}!`
        );

        // Simulate storing local audio file by adding a temporary ID
        setRecordedAudioIds((prev) => [...prev, generateSimulatedAudioId()]);

        if (recordedAudioIds.length + 1 < TOTAL_SENTENCES) {
          setHasRecording(false);
        }
      } else {
        showError(
          `❌ Voice Mismatch. Transcribed: "${mockTranscription}" vs. Expected: "${expectedSentence}"`
        );
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
    if (isSubmitting || recordedAudioIds.length !== TOTAL_SENTENCES) return;

    const uploadToast = showLoading("Uploading 5 audio files to Cloudinary...");
    setIsSubmitting(true);

    try {
      // NOTE: In a real app, you would fetch the actual audio Blobs/Files
      // and send them one by one using FormData with the /upload-audio endpoint.

      const uploadPromises = recordedAudioIds.map((audioId, index) => {
        // --- START: Simulate Backend File Upload ---

        // Mock unique Cloudinary URL for simulation purposes
        const mockCloudinaryUrl = `${
          API_BASE_URL.split("/voice-web-app/api")[0]
        }/res.cloudinary.com/dph8p9dwh/video/upload/v175588797${index}/${audioId.replace(
          ".wav",
          ""
        )}`;

        // Simulate fetch call to local backend /upload-audio endpoint
        return new Promise((resolve) => {
          setTimeout(() => {
            // Mock success response from backend's uploadTrainingAudio
            resolve({
              success: true,
              url: mockCloudinaryUrl,
              message: `Upload successful for sample ${index + 1}`,
            });
          }, 500 + index * 100);
        });

        // --- END: Simulate Backend File Upload ---
      });

      const uploadResults = await Promise.all(uploadPromises);

      const failedUploads = uploadResults.filter((res) => !res.success);
      if (failedUploads.length > 0) {
        throw new Error(`${failedUploads.length} files failed to upload.`);
      }

      const urls = uploadResults.map((res) => res.url);
      setCloudinaryUrls(urls);
      setIsUploadComplete(true);

      dismiss(uploadToast);
      showSuccess("All voice samples uploaded successfully to Cloudinary! 🎉");
    } catch (error) {
      dismiss(uploadToast);
      showError(`Upload failed: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrainModel = async () => {
    if (isSubmitting || !isUploadComplete || isModelTrained) return;

    const trainingToast = showLoading("Starting voice model training...");
    setIsSubmitting(true);

    try {
      const username = user?.username || "sample"; // Use authenticated user's username
      const externalApiUrl = `https://voice-recognition-api.onrender.com/api/v1/test_user?username=${username}`;

      const response = await fetch(externalApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the array of Cloudinary URLs as the request body
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
      showSuccess(
        "Voice model trained successfully! Authentication is now configured. 🎉"
      );
    } catch (error) {
      dismiss(trainingToast);
      showError(error.message || "Failed to initiate voice model training.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVoiceTraining = () => {
    setRecordedAudioIds([]);
    setCloudinaryUrls([]);
    setIsUploadComplete(false);
    setIsModelTrained(false);
    setHasRecording(false);
    setIsRecording(false);
    setRecordingTime(0);
    showInfo("Voice training progress reset.");
  };

  const handleCloseTraining = () => {
    setShowVoiceTraining(false);
  };

  // Logic to determine the main button's text and action
  const isAllRecorded = recordedAudioIds.length === TOTAL_SENTENCES;
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
      mainButtonText = isSubmitting
        ? "Uploading Voices..."
        : "Upload The Voices";
      mainButtonIcon = isSubmitting ? (
        <Brain className="w-5 h-5 mr-2 animate-pulse" />
      ) : (
        <Brain className="w-5 h-5 mr-2" />
      );
    } else {
      mainButtonAction = handleTrainModel;
      mainButtonText = isSubmitting ? "Training Model..." : "Train Voice Model";
      mainButtonIcon = isSubmitting ? (
        <Brain className="w-5 h-5 mr-2 animate-pulse" />
      ) : (
        <Brain className="w-5 h-5 mr-2" />
      );
    }
  }

  return (
    <>
      {/* Voice Training Section in Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Voice Model Training
          </CardTitle>
          <CardDescription>
            Train your personal voice model for enhanced authentication
            accuracy. This is a one-time setup process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Training Process:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Speak {TOTAL_SENTENCES} different sentences clearly</li>
              <li>• Each recording has a 10-second limit</li>
              <li>• Voice matching is verified in real-time</li>
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

          {recordedAudioIds.length > 0 && !isModelTrained && (
            <div className="text-center">
              <p className="text-sm font-medium text-primary">
                Progress: {recordedAudioIds.length}/{TOTAL_SENTENCES} sentences
                recorded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Training Dialog */}
      <Dialog open={showVoiceTraining} onOpenChange={setShowVoiceTraining}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {isModelTrained ? "Training Complete" : "Voice Model Training"}
            </DialogTitle>
            <DialogDescription>
              {isModelTrained
                ? "Your voice model is ready to use for authentication."
                : `Complete all ${TOTAL_SENTENCES} sentences to train your personalized voice model`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Training Progress</span>
                <span className="text-muted-foreground">
                  {recordedAudioIds.length}/{TOTAL_SENTENCES} completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`bg-${
                    isModelTrained ? "green-600" : "primary"
                  } h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{
                    width: `${
                      (recordedAudioIds.length / TOTAL_SENTENCES) * 100
                    }%`,
                  }}
                >
                  {recordedAudioIds.length > 0 && (
                    <span className="text-xs text-primary-foreground font-medium">
                      {Math.round(
                        (recordedAudioIds.length / TOTAL_SENTENCES) * 100
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {isModelTrained ? (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                        Model Ready! 🎉
                      </h3>
                      <p className="text-muted-foreground">
                        Your personalized voice model is active and ready for
                        authentication.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Current Sentence Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-lg">
                      Sentence {recordedAudioIds.length + 1} of{" "}
                      {TOTAL_SENTENCES}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold p-6 bg-background/50 rounded-lg border-2 border-dashed border-primary/30">
                        "{trainingSentences[recordedAudioIds.length]}"
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {isAllRecorded
                          ? "All required sentences have been recorded."
                          : "Click the microphone button and speak the sentence above clearly and naturally"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recording Controls (Hidden if all are recorded, use main action button below) */}
                {!isAllRecorded && (
                  <div className="text-center space-y-4">
                    {!isRecording && !hasRecording && (
                      <Button
                        onClick={startRecording}
                        size="lg"
                        className="w-40"
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
                            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(recordingTime / 10) * 100}%` }}
                          />
                        </div>
                        <Button
                          onClick={stopRecording}
                          variant="secondary"
                          size="lg"
                          disabled={isSubmitting}
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
                          <span className="text-lg font-medium">
                            Recording completed
                          </span>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={submitRecording}
                            size="lg"
                            className="px-8"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? "Submitting..."
                              : "Submit Recording"}
                          </Button>
                          <Button
                            onClick={() => setHasRecording(false)}
                            variant="outline"
                            size="lg"
                            disabled={isSubmitting}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Record Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Completed Sentences List */}
            {recordedAudioIds.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-green-600">
                    ✓ Recorded & Matched Sentences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recordedAudioIds.map((id, index) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded"
                      >
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="font-medium">#{index + 1}:</span>
                        <span>"{trainingSentences[index]}"</span>
                        {isUploadComplete && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            Uploaded:{" "}
                            {
                              cloudinaryUrls[index]
                                .split("/")
                                .pop()
                                .split("?")[0]
                            }
                          </span>
                        )}
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

              {recordedAudioIds.length > 0 && !isModelTrained && (
                <Button
                  variant="outline"
                  onClick={resetVoiceTraining}
                  className={
                    isAllRecorded && !isModelTrained ? "flex-1" : "w-full"
                  }
                  disabled={isSubmitting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Training
                </Button>
              )}

              {(!isAllRecorded || isModelTrained) && (
                <Button
                  variant="outline"
                  onClick={handleCloseTraining}
                  className="flex-1"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
