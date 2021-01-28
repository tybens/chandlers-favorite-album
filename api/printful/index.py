import urllib.request
import base64
import requests
import json
import os
from flask import Flask, jsonify, request, redirect, send_file, make_response

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
def catch_all(path):
    
    # get data from POST request
    data = request.get_json()
    # make order and confirm
    success, response = create_printful_order(data)

    if success and response.status_code == 200:
        print('order created')
        print('resonse')
        return {'200': 'Order Created'}
    else:
        print('order was not created')
        return jsonify(error=str(response.text)), response.status_code

def create_printful_order(orderData):
    ''' This function submits a printful order '''

    url = 'https://api.printful.com/orders'

    user, pwd = os.environ.get('PRINTFUL_API_KEY').split(':')

    headers = {'content-type': 'application/json'}
    try:
        response = requests.post(url, data=json.dumps(orderData),
                                 auth=requests.auth.HTTPBasicAuth(user, pwd),
                                 headers=headers)

        print("response = ", response.status_code, response.text)

        return True, response
    except requests.exceptions.RequestException as e:
        print("ERROR: When submitting order with requests, "
              "error message: %s" % str(e))
        return False, e

    # TODO: automate confirmation
    confirm_order(response.id, headers)


def confirm_order(orderId, headers):

    urlConfirm = f'https://api.printful.com/orders/{orderId}/confirm'

    if False:
        try:
            response = requests.post(urlConfirm, headers=headers)

            print("response = ", response.status_code, response.text)

            return True, response
        except requests.exceptions.RequestException as e:
            print("ERROR: When submitting order with requests, "
                  "error message: %s" % str(e))
            return False, e


if '__main__' == __name__:

    print("hello world")
