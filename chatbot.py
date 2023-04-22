import openai
import json

# API key
openai.api_key

# for building on previous conversation
conversation = []

# inputs all strings
def preamble(language, preamble_text):
    prompt_text = "You are languageGPT, I am trying to learn " + language + ". You will act as " + preamble_text
    preamble_output = openai.Completion.create(
        engine = "text-davinci-003", 
        prompt = prompt_text, 
        temperature = 0.7, 
        max_tokens = 60, 
        n = 1
    )
    response_text = preamble_output.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append("User: " + preamble_text)
    conversation.append("Bot: " + output)
    return output

def chatbot(text):
    chatbot_response = openai.Completion.create(
        engine = "text-davinci-003", 
        prompt = " ".join(conversation[-4:]) + "Bot: " + text, 
        temperature = 0.7, 
        max_tokens = 60, 
        n = 1
    )
    # parse response
    response_text = chatbot_response.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append("User: " + text)
    conversation.append("Bot: " + output)

    # make sure there is a followup question
    if output[-1] != "?":
        print("-----FOLLOWUP-----")
        followup_response = openai.Completion.create(
            engine = "text-davinci-003", 
            prompt = "Ask a follow up question based on the following conversation: " + " ".join(conversation[-4:]), 
            temperature = 0.7, 
            max_tokens = 20, 
            n = 1
        )
        followup_response_text = followup_response.choices[0].text.strip()
        output += followup_response_text.replace("\n", " ")
        conversation[-1] = output

    return output

# for testing ---------------------------------

# get preamble from user
user_input = input("Preamble: ")
bot_output = preamble("french", user_input)
print("Bot: " + bot_output)

while True:
    user_input = input("You: ")
    bot_output = chatbot(user_input)
    print("Bot: " + bot_output)
    if user_input.lower() == "exit":
        break
