import openai
import json

# API key
openai.api_key = "API key -- ask alice"

# parameters for API req
model_engine = "davinci-x"
prompt_text = "hi, how are you doing today?"
temperature = 0.7
max_tokens = 20

# input language
language = "en"

# send API req
response = openai.Completion.create(
    engine = model_engine, 
    prompt = prompt_text, 
    temperature = temperature, 
    max_tokens = max_tokens, 
    language = language
)

# parse response
response_text = response.choices[0].text.strip()
response_text = response_text.replace("\n", " ")

# print response
print(response_text)
