from fastapi import FastAPI, Request
import tensorflow as tf
import cv2 # type: ignore
import numpy as np
import uvicorn

app = FastAPI()
model = tf.keras.models.load_model("../models/disaster_model/model.h5")

def preprocess_frame(frame_data: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    return np.expand_dims(img, axis = 0)

@app.post("/predict")
async def predict(request: Request):
    frame = await request.body()
    img = preprocess_frame(frame)
    prediction = model.predict(img)
    classes = ['processed_earthquake', 'processed_flood', 'processed_landslide', 'processed_normal', 'processed_tsunami']
    result = {
        "class" : classes[np.argmax(prediction[0])],
        "probability" : {classes[i]: float(prediction[0][i]) for i in range(len(classes))}
    }
    
if __name__ == "__main__":
    uvicorn.run(app, host = "0.0.0.0", port = 8000)