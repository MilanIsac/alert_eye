const Camera = require('../models/Camera');
const MLClient = require('../services/mlClient');
const { spawn } = require('child_process');
const ffmpeg = require('../utils/ffmpeg');

exports.startStream = async (req, res) => {
  try {
    const { cameraId } = req.body;
    const camera = await Camera.findById(cameraId);
    if (!camera) {
      return res.status(404).json({ error: 'Camera not found' });
    }

    // Start FFmpeg to process the stream (example)
    const streamUrl = camera.streamUrl; // Assume Camera model has this field
    const outputPath = `/tmp/stream_${cameraId}.jpg`; // Temporary image output
    const ffmpegProcess = spawn('ffmpeg', [
      '-i', streamUrl,
      '-vf', 'fps=1', // Capture 1 frame per second
      '-update', '1',
      outputPath,
    ]);

    ffmpegProcess.on('error', (err) => {
      console.error('FFmpeg error:', err);
      res.status(500).json({ error: 'Failed to start stream' });
    });

    ffmpegProcess.on('exit', (code) => {
      if (code !== 0) console.error('FFmpeg exited with code', code);
    });

    // Periodically check and predict
    setInterval(async () => {
      const prediction = await MLClient.predictDisaster(outputPath);
      if (prediction.probability[prediction.class] > 0.7) { // Threshold
        await notificationService.sendNotification({
          message: `High confidence ${prediction.class} detected on Camera ${cameraId}`,
          recipients: ['official1@example.com'],
        });
      }
    }, 5000); // Check every 5 seconds

    res.json({ message: 'Stream started', cameraId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start stream' });
  }
};

exports.stopStream = async (req, res) => {
  try {
    const { cameraId } = req.body;
    // Logic to stop FFmpeg process (implement based on your setup)
    res.json({ message: 'Stream stopped', cameraId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop stream' });
  }
};