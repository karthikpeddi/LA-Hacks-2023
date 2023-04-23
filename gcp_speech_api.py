import os, openai, json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech_v1 as texttospeech
from io import BytesIO
import base64
import ffmpeg

# API key
openai.api_key = "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"

# for building on previous conversation
conversation = []

file = "lang_code_name.json"
with open(file, 'r') as f:
    lang_code_mapping = json.load(f)
# inputs all strings
def preamble(language_code, preamble_speaker, preamble_background):
    conversation.clear()
    prompt_text = f"You are a {preamble_speaker} who only speaks {lang_code_mapping[language_code]}. {preamble_background}"
    if lang_code_mapping[language_code] != "English":
        prompt_text += "Do not speak English. "
    prompt_text += "Keep your responses concise."
    print(prompt_text)
    conversation.append(prompt_text + "\n")
    preamble_output = openai.Completion.create(
        engine = "text-davinci-003", 
        prompt = conversation[0] + "\n",
        temperature = 0.5, 
        max_tokens = 60, 
        n = 1
    )
    response_text = preamble_output.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append(output)
    return output

def chatbot(text):
    conversation.append(text)
    chatbot_response = openai.Completion.create(
        engine = "text-davinci-003", 
        prompt = "\n".join(conversation) + "\n",
        temperature = 0.5, 
        max_tokens = 60, 
        n = 1
    )

    print(chatbot_response)
    # parse response
    response_text = chatbot_response.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append(output)

    return output


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'	

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'phrasal-indexer-384507-984f378d8298.json'

speech_client = speech.SpeechClient()
texttospeech_client = texttospeech.TextToSpeechClient()

@app.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    data = request.get_json()

    # STEP 1: DECODE AUDIO DATA INTO TEXT
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
    
    print("TRANSCRIPT:", transcript)
    response_chat_gpt = chatbot(transcript)
    print("CHATGPT RESPONSE:", response_chat_gpt)
    print("CONVERSATIONS:", conversation)

    input_text = texttospeech.SynthesisInput(text=response_chat_gpt)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = texttospeech_client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    audio_file = BytesIO(response.audio_content)
    audio_file.seek(0)

    return {
        "audio": base64.b64encode(response.audio_content).decode('utf-8'),
        "userTranscript": transcript,
        "botTranscript": response_chat_gpt
    }

    response = send_file(
        audio_file, mimetype='audio/mpeg', as_attachment=True, attachment_filename='output.mp3'
    )
    response.set_cookie('x-user-transcript', transcript)
    response.set_cookie('x-bot-transcript', response_chat_gpt)

    return response

@app.route("/setup",methods=['POST'])
@cross_origin()
def first_setup():
    preamble_speaker = request.json.get("speaker", "")
    preamble_background = request.json.get("background", "")
    language_code = request.json.get("language", "en-US")

    output = preamble(language_code, preamble_speaker, preamble_background)
    input_text = texttospeech.SynthesisInput(text=output)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )

    response = texttospeech_client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    audio_file = BytesIO(response.audio_content)
    audio_file.seek(0)

    print("conversations:", conversation)

    return {
        "audio": base64.b64encode(response.audio_content).decode('utf-8'),
        "botTranscript": output,
    }

    response = send_file(
        audio_file, mimetype='audio/mpeg', as_attachment=True, attachment_filename='output.mp3'
    )
    response.set_cookie('x-bot-transcript', output)

    return response

@app.route("/clear",methods=["POST"])
@cross_origin()
def exit_conversation_context():
    conversation.clear()
    return "Success", 200


if __name__ == '__main__':
    app.run(debug=True)
