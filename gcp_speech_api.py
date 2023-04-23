import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech_v1 as texttospeech
from io import BytesIO
import base64
import ffmpeg

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Set the path to the JSON key file
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'phrasal-indexer-384507-984f378d8298.json'

# Initialize clients
speech_client = speech.SpeechClient()
texttospeech_client = texttospeech.TextToSpeechClient()

@app.route('/audio-to-text', methods=['POST'])
@cross_origin()
def audio_to_text():
    data = request.get_json()

    audio_webm_base64 = data['audio']
    decoded_webm = base64.b64decode(audio_webm_base64)
    webm_file = f'./audio/webm/test{audio_webm_base64[0]}.webm'
    with open(webm_file, 'wb') as wfile:
        wfile.write(decoded_webm)

    ffmpeg.input(webm_file).output(f'./audio/flac/test{audio_webm_base64[0]}.flac').run(overwrite_output=True)
    language_code = data.get('language', 'en-US')

    with open(f'./audio/flac/test{audio_webm_base64[0]}.flac', 'rb') as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        language_code=language_code
    )

    response = speech_client.recognize(config=config, audio=audio)
    transcript = ''
    for result in response.results:
        transcript += result.alternatives[0].transcript

    return jsonify({'transcript': transcript})

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    text = data['text']
    language_code = data.get('language', 'en-US')

    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = texttospeech_client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )

    audio_file = BytesIO(response.audio_content)
    audio_file.seek(0)

    return send_file(
        audio_file, mimetype='audio/mpeg', as_attachment=True, attachment_filename='output.mp3'
    )

if __name__ == '__main__':
    app.run(debug=True)
