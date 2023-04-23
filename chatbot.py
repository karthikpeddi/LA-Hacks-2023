import openai
import json

# API key
openai.api_key = "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"

# for building on previous conversation
conversation = []

# inputs all strings
def preamble(language, preamble_text):
    prompt_text = "Can you pretend to be a " + preamble_text + " speaking " + language + " ?"
    conversation.append("User: " + prompt_text + "\n")
    preamble_output = openai.Completion.create(
        engine = "text-davinci-003", 
        prompt = conversation[0] + "\n",
        temperature = 0.5, 
        max_tokens = 60, 
        n = 1
    )
    response_text = preamble_output.choices[0].text.strip()
    output = response_text.replace("\n", " ")
    conversation.append("Bot: " + output)
    return output

def chatbot(text):
    conversation.append("User: " + text)
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

    # make sure there is a followup question
    #if output[-1] != "?":
    #    print("-----FOLLOWUP-----")
    #    followup_response = openai.Completion.create(
    #        engine = "text-davinci-002", 
    #        prompt = "Ask a follow up question as the bot based on the following conversation: " + "\n".join(conversation[4:]), 
    #        temperature = 0.5, 
    #        max_tokens = 20, 
    #        n = 1
    #    )
    #    followup_response_text = followup_response.choices[0].text.strip()
    #    output = followup_response_text.replace("\n", " ")
    #    conversation.append(output)

    return output

# for testing ---------------------------------

# get preamble from user
user_input = input("Preamble: ")
bot_output = preamble("french", user_input)
print(bot_output)

while True:
    if user_input.lower() == "exit":
        break
    user_input = input("You: ")
    bot_output = chatbot(user_input)
    print(bot_output)
