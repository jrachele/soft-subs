# SoftSubs

A Chrome extension which uses OCR to attempt to convert "hard" subtitles (embedded subtitles) into "soft" subtitles that can be used with screen readers, popup dictionaries, clipboard managers, etc.

## Installation

Install the extension itself by cloning this repository and then loading the dist/ folder as an unpacked plugin in your browser.

Note that in order for the plugin to work, you will need to run the OCR server locally, which is built upon [PaddlePaddle](https://github.com/PaddlePaddle/PaddleOCR/)

To do so, there is a script that will do everything for you. Just run the script run-server.sh (you may need to perform `sudo chmod +x run-server.sh` first). This will download everything you need and then begin running the server.

Once the server's running, you should be good to go! The first run will take a minute or so to gather the OCR prerequisites, but after that each call should only take a fraction of a second.