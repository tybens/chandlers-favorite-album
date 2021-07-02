import io
import urllib.request
from urllib.parse import urlparse, unquote
from http.server import BaseHTTPRequestHandler
from PIL import Image



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


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urlparse(unquote(self.path))
        swag_id = parsed_path.query
        img = main(swag_id)
        self.send_response(200)
        self.send_header(
            'Cache-Control', 's-maxage=31449600, stale-while-revalidate')
        self.send_header(
            'ETag', 'W/foobar')
        self.end_headers()
        print(img)
        self.wfile.write(img.read())
        return