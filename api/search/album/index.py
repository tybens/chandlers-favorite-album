import requests
import re

from bs4 import BeautifulSoup
from flask import Flask, jsonify, request, redirect, make_response

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    q = request.args.get('q')
    resp = jsonify(search(q))
    resp.headers['Cache-Control'] = 's-maxage=86400, stale-while-revalidate'
    return resp


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
