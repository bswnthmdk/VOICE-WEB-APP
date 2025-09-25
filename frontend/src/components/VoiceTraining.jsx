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
// Import toast functions
import { showSuccess, showError, showLoading, dismiss } from "@/lib/toast";

export default function VoiceTraining({ onClose }) {
  // Voice training states
  const [showVoiceTraining, setShowVoiceTraining] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [completedSentences, setCompletedSentences] = useState([]);
  const [hasRecording, setHasRecording] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  // New state to manage submission loading and button disabling
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample sentences for voice training
  const trainingSentences = [
    "Open the door",
    "Access granted now",
    "Security check complete",
    "Voice authentication ready",
    "System unlock confirmed",
  ];

  const startRecording = () => {
    // ... (rest of startRecording remains the same)
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
    // ... (rest of stopRecording remains the same)
    setIsRecording(false);
    setHasRecording(true);
    setRecordingTime(0);
  };

  const submitRecording = async () => {
    const expectedSentence = trainingSentences[currentSentenceIndex];

    // --- START: Simulate Transcription and Validation Process ---
    const loadingToast = showLoading("Transcribing and validating voice...");
    setIsSubmitting(true);

    try {
      // 1. Simulate Audio Upload and Transcription (in a real app, this would be an API call)
      // For demo, simulate a 70% success rate with transcription matching the sentence exactly.
      const isPerfectMatch = Math.random() > 0.3; // 70% chance of a perfect match
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
        showSuccess(`✅ Voice Matched! Transcribed: "${mockTranscription}"`);
        const newCompleted = [...completedSentences, currentSentenceIndex];
        setCompletedSentences(newCompleted);

        if (currentSentenceIndex < trainingSentences.length - 1) {
          setCurrentSentenceIndex(currentSentenceIndex + 1);
          setHasRecording(false);
        } else {
          // All sentences completed
          setIsTrainingComplete(true);
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
    // --- END: Simulate Transcription and Validation Process ---
  };

  const trainModel = () => {
    // Simulate model training
    dismiss(); // Dismiss any existing toasts
    const trainingToast = showLoading(
      "Voice model training started! This may take a few moments..."
    );

    // Simulate training delay
    setTimeout(() => {
      dismiss(trainingToast);
      showSuccess(
        "Voice model trained successfully! Authentication is now ready."
      );
      setShowVoiceTraining(false);
      onClose(); // Close the main settings dialog

      // Reset training state for next time
      resetVoiceTraining();
    }, 3000);
  };

  const resetVoiceTraining = () => {
    setCurrentSentenceIndex(0);
    setCompletedSentences([]);
    setIsTrainingComplete(false);
    setHasRecording(false);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleCloseTraining = () => {
    setShowVoiceTraining(false);
    // Don't reset state when just closing, in case user wants to continue later
  };

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
              <li>• Speak 5 different sentences clearly</li>
              <li>• Each recording has a 10-second limit</li>
              <li>• Voice matching is verified in real-time</li>
              <li>• Complete all sentences to train your model</li>
            </ul>
          </div>

          <Button
            onClick={() => setShowVoiceTraining(true)}
            className="w-full"
            size="lg"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Voice Training
          </Button>

          {completedSentences.length > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Progress: {completedSentences.length}/5 sentences completed
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
              Voice Model Training
            </DialogTitle>
            <DialogDescription>
              Complete all 5 sentences to train your personalized voice model
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Training Progress</span>
                <span className="text-muted-foreground">
                  {completedSentences.length}/5 completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(completedSentences.length / 5) * 100}%` }}
                >
                  {completedSentences.length > 0 && (
                    <span className="text-xs text-primary-foreground font-medium">
                      {Math.round((completedSentences.length / 5) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isTrainingComplete ? (
              <>
                {/* Current Sentence Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-lg">
                      Sentence {currentSentenceIndex + 1} of 5
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold p-6 bg-background/50 rounded-lg border-2 border-dashed border-primary/30">
                        "{trainingSentences[currentSentenceIndex]}"
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Click the microphone button and speak the sentence above
                        clearly and naturally
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recording Controls */}
                <div className="text-center space-y-4">
                  {!isRecording && !hasRecording && (
                    <Button onClick={startRecording} size="lg" className="w-40">
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
                        >
                          Submit Recording
                        </Button>
                        <Button
                          onClick={() => setHasRecording(false)}
                          variant="outline"
                          size="lg"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Record Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Completed Sentences List */}
                {completedSentences.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-green-600">
                        ✓ Completed Sentences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {completedSentences.map((index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded"
                          >
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="font-medium">#{index + 1}</span>
                            <span>"{trainingSentences[index]}"</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Training Complete Card */
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                        Training Complete! 🎉
                      </h3>
                      <p className="text-muted-foreground">
                        All sentences have been successfully recorded and
                        verified. Ready to train your personalized voice model.
                      </p>
                    </div>
                    <Button
                      onClick={trainModel}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Train Voice Model
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 border-t">
              {!isTrainingComplete && completedSentences.length > 0 && (
                <Button
                  variant="outline"
                  onClick={resetVoiceTraining}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Training
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleCloseTraining}
                className="flex-1"
              >
                {isTrainingComplete ? "Close" : "Save & Close"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
