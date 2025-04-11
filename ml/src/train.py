import tensorflow as tf  # type: ignore
from tensorflow.keras import layers, models  # type: ignore
import os
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

def create_disaster_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation="relu", input_shape=(224, 224, 3), padding="same"),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation="relu", padding="same"),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(5, activation="softmax")
    ])
    return model

def load_data(data_dir):
    train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode="nearest"
    )
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=16,
        class_mode="categorical",
        classes=['processed_earthquake', 'processed_flood', 'processed_landslide', 'processed_normal', 'processed_tsunami']
    )
    return train_generator

if __name__ == "__main__":
    model = create_disaster_model()
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    data_dir = "E:/All projects/alert_eye/ml/data/processed"
    print("Checking directory contents:", os.listdir(data_dir))  # Debug
    for folder in os.listdir(data_dir):
        print(f"Contents of {folder}:", os.listdir(os.path.join(data_dir, folder)))
    train_data = load_data(data_dir)
    
    checkpoint = ModelCheckpoint(
        "../models/disaster_model/checkpoint.h5",
        monitor="accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor="accuracy",
        patience=3,
        verbose=1,
        restore_best_weights=True
    )
    
    model.fit(
        train_data,
        epochs=10,
        steps_per_epoch=train_data.samples // train_data.batch_size,
        callbacks=[checkpoint, early_stopping]
    )
    
    output_dir = "../models/disaster_model"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    model.save(os.path.join(output_dir, "model.h5"))
    print("Model saved to ", os.path.join(output_dir, "model.h5"))