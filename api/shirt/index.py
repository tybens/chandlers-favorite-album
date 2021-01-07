import io
import urllib.request

from flask import Flask, jsonify, request, redirect, send_file, make_response
from PIL import Image

app = Flask(__name__)


def download_image(url):
    """Download a PIL image from a url"""
    return Image.open(io.BytesIO(urllib.request.urlopen(url).read())).convert(mode='RGBA')


def main(swag_id) -> io.BytesIO:
    bg = Image.open('./template/shirt.png').convert(mode='RGBA')
    fg = download_image(f'https://chandlersfavorite.s3.us-east-2.amazonaws.com/{swag_id}/swag.png')
    scale = float(bg.width) / float(fg.width)
    fg = fg.resize((bg.width, int(fg.height * scale)), Image.ANTIALIAS)
    scale = 4.2
    fg = fg.resize((int(fg.width / scale), int(fg.height / scale)), Image.ANTIALIAS)
    x = int(bg.width / 2.0) - int(fg.width / 2.0)
    y = int(bg.height / 2.0) - int(fg.height / 1.4)
    bg.paste(fg, (x, y), fg)
    output = io.BytesIO()
    bg.save(output, format='png')
    output.seek(0)

    return output


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    token = request.args.get('token')
    img = main(token)
    resp = make_response(send_file(img, attachment_filename='shirt.png', mimetype='image/png'))
    resp.headers['Cache-Control'] = 's-maxage=31449600, stale-while-revalidate'
    resp.headers['ETag'] = 'W/"foobar"'
    return resp
