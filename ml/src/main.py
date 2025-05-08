from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tensorflow as tf
import cv2
import numpy as np
import uvicorn
from pathlib import Path
from stream import StreamProcessor

app = FastAPI()

model_path = "../models/disaster_model/model.h5"
processor = StreamProcessor(model_path)
classes = ["earthquake", "flood", "landslide", "normal", "tsunami"]

def preprocess_frame(frame_data: bytes) -> dict:
    img = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Failed to decode image")
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    
    prediction = processor.model.predict(img)
    predicted_class = classes[np.argmax(prediction[0])]
    probability = float(prediction[0][np.argmax(prediction[0])])
    
    return {
        "class": predicted_class,
        "probability": {predicted_class: probability}
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        frame_data = await file.read()
        prediction = preprocess_frame(frame_data)
        return JSONResponse(content=prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/stream/{camera_id}")
async def stream(camera_id: str, stream_url: str, auth_token: str):
    try:
        predictions = processor.start_stream(stream_url, camera_id, auth_token)
        prediction = next(predictions, None)
        if prediction:
            return JSONResponse(content=prediction)
        else:
            raise HTTPException(status_code=500, detail="Failed to process stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming failed: {str(e)}")
    finally:
        processor.stop_stream()

@app.post("/stop_stream/{camera_id}")
async def stop_stream(camera_id: str):
    try:
        processor.stop_stream()
        return JSONResponse(content={"message": f"Stream stopped for camera {camera_id}"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop stream: {str(e)}")

@app.get("/test")
async def test():
    print("Test endpoint hit")
    return {"message": "Server is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)