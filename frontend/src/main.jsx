import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AudioRecorder from "./component/AudioRecorder.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AudioRecorder />
  </StrictMode>
);
