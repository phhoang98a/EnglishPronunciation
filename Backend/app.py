from flask import Flask, jsonify, request
from flask_cors import CORS
import eng_to_ipa as ipa
from pronunciation_assessment import pronunciationAssessment

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000/"])

@app.route("/ipa", methods=['POST'])
def getIPA():
    data = request.get_json()
    sentence = data.get('sentence', '')
    pronunciation = ipa.convert(sentence)
    return jsonify(pronunciation)

@app.route("/assessment", methods=['POST'])
def assessment():
    data = request.get_json()
    blobName = data.get('blobName', '')
    text = data.get('text', '')
    data = pronunciationAssessment(blobName, text)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)