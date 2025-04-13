from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import cv2
import numpy as np
import uvicorn

app = FastAPI()
model = tf.keras.models.load_model("../models/disaster_model/model.h5")

def preprocess_frame(frame_data: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Failed to decode image")
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    return np.expand_dims(img, axis=0)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        print(f"Received file: {file.filename}")
        frame = await file.read()
        if frame is None or len(frame) == 0:
            raise ValueError("Received empty or invalid frame data")
        img = preprocess_frame(frame)
        prediction = model.predict(img)
        classes = ['processed_earthquake', 'processed_flood', 'processed_landslide', 'processed_normal', 'processed_tsunami']
        result = {
            "class": classes[np.argmax(prediction[0])],
            "probability": {classes[i]: float(prediction[0][i]) for i in range(len(classes))}
        }
        return result
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

@app.get("/test")
async def test():
    print("Test endpoint hit")
    return {"message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)