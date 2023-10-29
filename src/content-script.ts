const { createWorker } = require('tesseract.js');

async function main(): Promise<void> {
    // Get the video element
    var video = document.querySelector('video');

    if (video === null)
    {
        console.log("Video is null!");
        return;
    }

    // Listen for the pause event
    video.addEventListener('pause', async function() {
        console.log("Video paused!");

        // Create a canvas element
        let canvas = document.createElement('canvas');

        // Get the 2D context of the canvas
        let context = canvas!.getContext('2d');

        // Set the canvas dimensions to match the video
        canvas.width = video!.videoWidth;
        canvas.height = video!.videoHeight;

        // Draw the current frame of the video onto the canvas
        context.filter = "contrast(2) brightness(0.75)";
        context!.drawImage(video!, 0, 0, canvas.width, canvas.height);
        canvas.style.position = "fixed";
        canvas.classList.add('soft-sub');
        document.body.appendChild(canvas);

        // You can then convert this to a data URL or Blob to download or display it
        let frameDataUrl = canvas.toDataURL('image/png');

        // The canvas is not appended to the document, so it's not visible.
  
        // Now you can use frameDataUrl for further processing...
        const worker = await createWorker('chi_sim');

        let heightRatio = video.videoHeight / window.innerHeight;
        let videoRect = video.getBoundingClientRect();

        let videoOffset = video.videoHeight * 0.25;

        const result = await worker.recognize(frameDataUrl, {
            rectangle: { top: video.videoHeight - videoOffset, left: 0, width: video.videoWidth, height: videoOffset },
          });
        console.log(result);


        let symbols = result.data.symbols.filter(symbol => symbol.confidence >= 95.0 && symbol.text.match(/[\u3400-\u9FBF]/));
        symbols.forEach(symbol => {
            let textOverlay = document.createElement('div');
            textOverlay.classList.add('soft-sub');
            textOverlay.style.position = 'absolute';
            textOverlay.style.fontSize = (heightRatio * symbol.word.font_size) + 'px';
            // textOverlay.style.fontSize = `${symbol.word.font_size}pt`
            textOverlay.style.left = videoRect.x + symbol.bbox.x0 + 'px';
            textOverlay.style.top = videoRect.y + symbol.bbox.y0 + 'px';
            textOverlay.style.color = 'transparent';
            textOverlay.innerHTML = symbol.text;
            document.body.appendChild(textOverlay);
            console.log(textOverlay);
        });


        await worker.terminate();

});

    video.addEventListener('play', clearAll);
    video.addEventListener('change', clearAll);


}

function clearAll() {
    document.querySelectorAll('.soft-sub').forEach((e, k, p) => e.parentElement.removeChild(e));
}

main();