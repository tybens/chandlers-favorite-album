import urllib.request
import base64
import requests
import json
import os
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # get body content length
        content_len = int(self.headers.get('Content-Length', 0))
        # read body based on content length
        post_body = self.rfile.read(content_len)
        print(post_body)
        # create and confirm order
        success, response = create_printful_order(post_body)
        # return info to user based on success
        if success and response.status_code == 200:
            print('order created')
            self.send_response(response.status_code)
            self.end_headers()
            self.wfile.write(json.dumps({"response": response}).encode("utf-8"))
            return
        else:
            print('order was not created')
            self.send_response(response.status_code)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(response.text)}).encode("utf-8"))
            return


def create_printful_order(orderData):
    ''' This function submits a printful order '''

    url = 'https://api.printful.com/orders'

    user, pwd = os.environ.get('PRINTFUL_API_KEY').split(':')

    headers = {'content-type': 'application/json'}
    try:
        response = requests.post(url, data=orderData,
                                 auth=requests.auth.HTTPBasicAuth(user, pwd),
                                 headers=headers)

        print("response = ", response.status_code, response.text)

        return True, response
    except requests.exceptions.RequestException as e:
        print("ERROR: When submitting order with requests, "
              "error message: %s" % str(e))
        return False, e

    # TODO: automate confirmation (right now it returns before this line) and it says false
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
