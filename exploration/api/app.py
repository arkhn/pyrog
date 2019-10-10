from flask import Flask, Blueprint, request, jsonify
import json

from errors.custom_error import CustomError
from client import connect, closeConnection

api = Blueprint('api', __name__)


@api.route("/connectiontest", methods=['GET'])
def connectionTest():
    # Init and reset database connection
    _, cursor = connect()

    # Run query
    cursor.execute("SELECT * from patients limit 10;")
    data = cursor.fetchall()
    print(data)

    # Close connection
    closeConnection()

    # return data
    return json.dumps(data, indent=4, sort_keys=True, default=str)


@api.errorhandler(CustomError)
def handle_bad_request(e):
    return str(e), 400


app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api')
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
