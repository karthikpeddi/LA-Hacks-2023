import os, openai, json
from flask import Flask, request, jsonify, send_file
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech_v1 as texttospeech
from io import BytesIO

# API key
openai.api_key = "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"

# for building on previous conversation
conversation = []

file = "lang_code_name.json"
with open(file, 'r') as f:
    lang_code_mapping = json.load(f)
# inputs all strings
def preamble(language, preamble_text):
    conversation=[]
    prompt_text = "Can you pretend to be a " + preamble_text + " speaking " + lang_code_mapping[language] + " ?"
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
    # parse response
    response_text = chatbot_response.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append(output)

    return output


app = Flask(__name__)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'phrasal-indexer-384507-984f378d8298.json'

speech_client = speech.SpeechClient()
texttospeech_client = texttospeech.TextToSpeechClient()

@app.route('/chat', methods=['POST'])
def chat():
    audio_file = request.files['audio']
    language_code = request.form.get('language', 'en-US')
    audio = speech.RecognitionAudio(content=audio_file.read())
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code=language_code
    )

    response = speech_client.recognize(config=config, audio=audio)
    transcript = ''
    for result in response.results:
        transcript += result.alternatives[0].transcript
    
    response_chat_gpt = chatbot(transcript)

    language_code = request.form.get('language', 'en-US')

    input_text = texttospeech.SynthesisInput(text=response_chat_gpt)
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

    return send_file(
        audio_file, mimetype='audio/wav', as_attachment=True, attachment_filename='output.wav'
    )

@app.route("/setup",methods=['POST'])
def first_setup():
    preamble_text = request.form['preamble']
    language = request.form['language']
    output = preamble(language,preamble_text)
    input_text = texttospeech.SynthesisInput(text=output)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language,
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

    return send_file(
        audio_file, mimetype='audio/wav', as_attachment=True, attachment_filename='output.wav'
    )

@app.route("/clear",methods=["POST"])
def exit_conversation_context():
    coversation = []
    return "Success", 200


if __name__ == '__main__':
    app.run(debug=True)
