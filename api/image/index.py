# //////////////////////////////////////////////////////////
#   I'm pretty sure this serverless function was intended
#   for the shop functionality
# //////////////////////////////////////////////////////////

import io
# import numpy
import random
import string
import boto3
import urllib.request
import os
import requests

from flask import Flask, jsonify, request, redirect
from PIL import Image
from urllib.parse import urlparse
from typing import List

app = Flask(__name__)
s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('SECRET_ACCESS_KEY')
)
COORDS =[(93, 204), (303, 216), (31, 354), (250, 405)]

COEFFS = [ 7.87970803e-01,  3.25694599e-01, -5.58891931e+02, -5.62940129e-02,
        9.85145226e-01, -7.82937132e+02,  3.63585476e-04,  3.74690231e-04] # yapf: disable



# PRECOMPUTED IN COEFFS BECAUSE NUMPY TOO FAT

# def find_coeffs(source_coords, target_coords):
#     matrix = []
#     for s, t in zip(source_coords, target_coords):
#         matrix.append([t[0], t[1], 1, 0, 0, 0, -s[0] * t[0], -s[0] * t[1]])
#         matrix.append([0, 0, 0, t[0], t[1], 1, -s[1] * t[0], -s[1] * t[1]])
#     A = numpy.matrix(matrix, dtype=numpy.float)
#     B = numpy.array(source_coords).reshape(8)
#     res = numpy.dot(numpy.linalg.inv(A.T * A) * A.T, B)
#     return numpy.array(res).reshape(8)

# def scale(coords, factor=4):
#     return [(x * factor, y * factor) for x, y in coords]


def download_image(url):
    """Download a PIL image from a url"""
    return Image.open(io.BytesIO(requests.get(url).content)).convert(mode='RGBA')




def main(album_url: str) -> io.BytesIO:
    # 'images/*' won't work when running as python command because of different pwd
    bg = Image.open('./public/images/chandler.png').convert(mode='RGBA')
    fg = Image.open('./public/images/chandler_front.png').convert(mode='RGBA')

    album = download_image(album_url).resize((bg.width, bg.height), resample=Image.ANTIALIAS)
    # commented out to make chandler hold the placeholder
    # album = Image.open('../../public/images/placeholder.png').convert(mode='RGBA')
    
    width, height = 384, 384
    album = album.resize((width, height), resample=Image.ANTIALIAS)
    coeffs = COEFFS
    # coeffs = find_coeffs(
    #     [(0, 0), (width, 0), (0, height), (width, height)], scale(COORDS[idx], factor=4)
    # )
    album = album.transform((width * 4, height * 4), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    album = album.resize((bg.width, bg.height), resample=Image.ANTIALIAS)
    bg = Image.alpha_composite(bg, album)

    bg = Image.alpha_composite(bg, fg)
    output = io.BytesIO()
    bg.save(output, format='png')
    output.seek(0)

    token = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    key = f'{token}/swag.png'
    bucket = 'chandlersfavorite'
    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=output,
        ContentType='image/png',
    )

    return token


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    album_url = request.args.get('album_url')
    token = main(album_url=album_url)
    url = urlparse(request.base_url)
    output_url = f'{url.scheme}://{url.netloc}/swag/{token}'
    return redirect(output_url, code=302)


if __name__ == '__main__':
    # coco channel : 'https://lastfm.freetls.fastly.net/i/u/300x300/46dba77b709911226e19bbbede284971.png'
    # to pimp a butterfly : https://lastfm.freetls.fastly.net/i/u/300x300/86b35c4eb3c479da49c915d8771bbd1a.png
    test_url = 'https://lastfm.freetls.fastly.net/i/u/300x300/86b35c4eb3c479da49c915d8771bbd1a.png'
    main(test_url)

