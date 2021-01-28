import os

from flask import Flask, jsonify, request, redirect, send_file, make_response
import stripe

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['GET'])
@app.route('/<path:path>', methods=['GET'])
def get_client_secret(path):
    try:
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(),
            currency='usd'
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })

    except Exception as e:
        return jsonify(error=str(e)), 403


def calculate_order_amount():
    """ Calculates order amount, trivial in my case"""

    # amount in cents
    return 1500
