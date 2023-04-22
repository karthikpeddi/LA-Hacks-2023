import openai
import json

# API key
openai.api_key

model_engine = "text-davinci-003"
temperature = 0.7
max_tokens = 20

# inputs all strings
def preamble(language, preamble_text, input_text):
    prompt_text = "you are speaking" + language + "." + preamble_text
    preamble_output = openai.Completion.create(
        engine = model_engine, 
        prompt = prompt_text, 
        temperature = temperature, 
        max_tokens = max_tokens
    )
    response_text = preamble_output.choices[0].text.strip()
    return response_text.replace("\n", " ")

def chatbot(text):
    prompt_text = text
    chatbot_response = openai.Completion.create(
        engine = model_engine, 
        prompt = prompt_text, 
        temperature = temperature, 
        max_tokens = max_tokens
    )
    # parse response
    response_text = chatbot_response.choices[0].text.strip()
    return response_text.replace("\n", " ")
