# SoftSubs

A Chrome extension which uses OCR to attempt to convert "hard" subtitles (embedded subtitles) into "soft" subtitles that can be used with screen readers, popup dictionaries, clipboard managers, etc.

## Installation

Install the extension itself by cloning this repository and then loading the dist/ folder as an unpacked plugin in your browser.

Note that in order for the plugin to work, you will need to run the OCR server locally, which is built upon [PaddlePaddle](https://github.com/PaddlePaddle/PaddleOCR/)

# Prerequisites
- You must have Python installed, preferably version 3.9. Some dependencies are not supported in Python 3.12, so opt for [Python 3.9](https://www.python.org/downloads/release/python-390/).

**NOTE: Make sure Python is added to your PATH! There is an option during the installer, check it**

# Linux/macOS
To run the server, there is a script provided for you, but you may need to execute some steps first:
1. Open a terminal
2. Navigate to the directory you extracted SoftSubs to by executing the `cd <SoftSubs Directory>`
3. Ensure the script is executable by running the command `sudo chmod +x run-server.sh`
4. Execute `./run-server.sh` to run the script

Once the server's running, you should be good to go! The first run will take a minute or so to gather the OCR prerequisites, but after that each call should only take a fraction of a second.

# Windows
To run the server, there is a script provided for you, but you may need to execute some steps first:
1. Open Powershell as an Administrator
2. Navigate to the directory you extracted SoftSubs to by executing the `cd <SoftSubs Directory>`
3. Change your execution policy for Powershell scripts by executing `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`. If you want this to persist forever, you can type `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope LocalMachine`
4. Execute `.\run-server.ps1` to run the script

Once the server's running, you should be good to go! The first run will take a minute or so to gather the OCR prerequisites, but after that each call should only take a fraction of a second.