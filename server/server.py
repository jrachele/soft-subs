from flask import Flask, request, jsonify, make_response
from werkzeug.exceptions import HTTPException
from PIL import Image
from paddleocr import PaddleOCR

import io
import base64
app = Flask(__name__)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

class ImageMissingException(HTTPException):
    code = 404
    description = "You must supply an image to the OCR"

ocr_map = {}
def get_ocr(lang):
    if lang in ocr_map:
        return ocr_map[lang]
    
    ocr = PaddleOCR(lang=lang)
    ocr_map[lang] = ocr
    return ocr

@app.route('/ocr/<lang>', methods=['POST', 'OPTIONS'])
def ocr(lang):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    data = request.get_json()

    if not "image" in data:
        raise ImageMissingException()

    image_data = data['image']

    # Remove header of data URL
    header, image_data = image_data.split(',', 1)

    # Decode the base64 data
    image_data = base64.b64decode(image_data)

    ocr = get_ocr(lang)
    res = ocr.ocr(image_data)

    response = jsonify(res)

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response