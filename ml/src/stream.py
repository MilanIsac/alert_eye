import cv2
import numpy as np
import tensorflow as tf
from pathlib import Path
import requests

class StreamProcessor:
    def __init__(self, model_path, output_dir="ml/data/cctv"):
        self.model = tf.keras.models.load_model(model_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.capture = None
        self.classes = ["earthquake", "flood", "landslide", "normal", "tsunami"]
        self.server_url = "http://localhost:5000"

    def start_stream(self, stream_url, camera_id, auth_token):
        self.capture = cv2.VideoCapture(stream_url)
        if not self.capture.isOpened():
            raise ValueError(f"Failed to open stream: {stream_url}")

        while True:
            ret, frame = self.capture.read()
            if not ret:
                print("Failed to grab frame")
                break

            # Save frame every second (1 FPS)
            output_path = self.output_dir / f"camera_{camera_id}.jpg"
            frame = cv2.resize(frame, (224, 224))
            cv2.imwrite(str(output_path), frame)
            print(f"Frame saved to {output_path}")

            # Preprocess frame for prediction
            img = frame / 255.0
            img = np.expand_dims(img, axis=0)

            # Predict
            prediction = self.model.predict(img)
            predicted_class = self.classes[np.argmax(prediction[0])]
            probability = float(prediction[0][np.argmax(prediction[0])])

            # If disaster detected, notify server
            if probability > 0.7 and predicted_class != "normal":
                try:
                    response = requests.post(
                        f"{self.server_url}/alerts",
                        json={
                            "cameraId": camera_id,
                            "location": "Unknown",
                            "severity": "high",
                            "message": f"Disaster detected: {predicted_class}"
                        },
                        headers={"Authorization": f"Bearer {auth_token}"}
                    )
                    print(f"Alert sent to server: {response.json()}")
                except Exception as e:
                    print(f"Failed to send alert to server: {str(e)}")

            yield {
                "class": predicted_class,
                "probability": {predicted_class: probability}
            }

            cv2.waitKey(1000)

    def stop_stream(self):
        if self.capture:
            self.capture.release()
            self.capture = None

if __name__ == "__main__":
    processor = StreamProcessor("../models/disaster_model/model.h5")
    stream_url = "rtsp://your-camera-url"
    try:
        for prediction in processor.start_stream(stream_url, "cam001", "your-token"):
            print(prediction)
    finally:
        processor.stop_stream()