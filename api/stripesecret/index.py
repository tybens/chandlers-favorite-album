import os

from http.server import BaseHTTPRequestHandler
import stripe
import json
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            intent = stripe.PaymentIntent.create(
                amount=calculate_order_amount(),
                currency='usd'
            )
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps({"clientSecret": intent['client_secret']}).encode("utf-8"))
            return 
        except Exception as e:
            self.send_response(400)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

def calculate_order_amount():
    """ Calculates order amount, trivial in my case"""

    # amount in cents
    return 1500
