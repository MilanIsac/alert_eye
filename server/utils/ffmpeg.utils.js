const { spawn } = require('child_process');

const startStream = (streamUrl, outputPath) => {
    return new Promise((resolve, reject) => {
        const ffmpegProcess = spawn('ffmpeg', [
            '-i', streamUrl,
            '-vf', 'fps=1',
            '-update', '1',
            outputPath
        ]);

        ffmpegProcess.on('error', (err) => {
            
        })
    })
}