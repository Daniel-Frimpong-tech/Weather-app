from flask import Flask, request, jsonify
import requests


app = Flask(__name__)



@app.route('/')
def frontend():
    return app.send_static_file('Weather.html')

@app.route('/weather', methods=['GET'])
def weather():
    location = request.args.get('location')
    fields = request.args.get('fields')
    timesteps = request.args.get('timesteps')
    units = request.args.get('units')
    timezone = request.args.get('timezone')
    if location:
        url = f'https://api.tomorrow.io/v4/timelines?location={location}&fields={fields}&timesteps={timesteps}&units={units}&timezone={timezone}&apikey=#'
        response = requests.get(url)
        data = response.json()
        if response.status_code == 200:
            return jsonify(data)
        else:
            return "Tommorrow.io API hit limit"
    else:
        return "Please provide a location"
    


if __name__ == "__main__":
    app.run()
