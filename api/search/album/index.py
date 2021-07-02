import requests
import re

from bs4 import BeautifulSoup
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
import json

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urlparse(self.path)
        query = parsed_path.query
        resp = search(query)
        self.send_response(200)
        self.send_header(
            'Cache-Control', 's-maxage=86400, stale-while-revalidate')
        self.end_headers()
        self.wfile.write(json.dumps(resp).encode("utf-8"))
        return
        
def search(query):
    resp = requests.get(f'https://www.last.fm/search/albums?q={query}')
    resp.raise_for_status()

    soup = BeautifulSoup(resp.content)

    return [
        {
            'url': re.sub('(\d+s)', '100s',
                          x.find('img').attrs['src']),
            'album': x.find('h4').a.text,
            'artist': x.find('p').a.text,
        } for x in soup.findAll('div', {'class': 'album-result-inner'})
    ]


if __name__ == '__main__':
    print(search('city of the weak'))
