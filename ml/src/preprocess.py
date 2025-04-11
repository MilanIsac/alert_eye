import cv2 # type: ignore
import os

def extract_frames(videos_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    cap = cv2.VideoCapture(videos_path)
    count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % 30 == 0: 
            cv2.imwrite(os.path.join(output_dir, f"frame_{count}.jpg"), frame)
        count += 1
    cap.release()
    
if __name__ == "__main__":
    disasters = ["earthquake", "flood", "tsunami", "landslide", "normal"]
    for disaster in disasters:
        video_dir = f"../data/youtube/{disaster}"
        for video_file in os.listdir(video_dir):
            if video_file.endswith(".mp4"):
                video_path = os.path.join(video_dir, video_file)
                output_path = os.path.join(f"../data/processed {disaster}")
                extract_frames(video_path, output_path)
    print(f"Frames extracted for {disaster} videos.")
            