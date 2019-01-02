# clapclap
Alexa Skill for Integrating with The Clapper™

## skill.json
The alexa skill definition

## index.js
The lambda function that handles the requests from the skill

# The Skill
Amazon has a decent interface for building Alexa skills. Using web-based forms, you can configure everything Alexa needs to listen for and what actions to perform. There are limitations to this, and if you need to, you can use more robust tools, but for a "hello, world"-style application like this the web-based tools suffice.

## Invocation Name
First, you specify the invocation name, which is the phrase used to access your skill. In order for Alexa to know which skill you're talking to, you preface your request with "ask <invocation name>". For example, my skill's invocation name is "my smart home", so to access my skill, I just have to say "Alexa, ask my smart home…", followed by a command my skill is designed to understand.
## Sessions
A skill can choose to be session-based. If you don't use sessions, users need to speak the invocation every time they want to use your skill. With a session, the user can submit subsequent commands without using the invocation, and your skill can keep them in a session until they are finished. I implemented this skill using sessions to make it quicker to demonstrate flipping the lights on and off.
## Intents
The next step in building a skill is to specify "intents". Intents are phrases that are parsed by the Alexa natural language parser. They can be simple commands, like "turn off" or "turn on", or they can have parameter slots, like "turn the <device> on". Alexa's NLP takes all of the intents you specify, and creates a model for understanding speech and figuring out which intent matches what is said, if any. The name of the intent, along with the value of any parameters, are passed to endpoints for processing.
For my skill, I created two intents, one called "clapclap" for controlling The Clapper's primary device, and "clapclapclap" for controlling the alternate device. I chose not to use parameter slots for this first version, as there are only a few ways you might refer to an alternate device, but I can see how it might simplify things a bit.
You configure the Alexa skill with sample phrases that map to intents you wish to handle. For my skill, I configured my intents with these phrases:
```
{
    "name": "clapclap",
    "slots": [],
    "samples": [
        "turn the device off",
        "turn the device on",
        "turn off",
        "turn on",
        "turn the light off",
        "turn the light on",
        "flip the light",
        "flip the device",
        "flip the light on",
        "flip the light off",
        "flip the device on",
        "flip the device off"
    ]
},
{
    "name": "clapclapclap",
    "slots": [],
    "samples": [
        "turn the alternate light off",
        "turn the alternate light on",
        "turn the alternate device off",
        "turn the alternate device on",
        "flip the alternate light",
        "flip the alternate light on",
        "flip the alternate light off",
        "flip the alternate device",
        "flip the alternate device on",
        "flip the alternate device off",
        "turn the other light off",
        "turn the other light on",
        "turn the other device off",
        "turn the other device on",
        "flip the other light",
        "flip the other device",
        "flip the other light on",
        "flip the other light off",
        "flip the other device on",
        "flip the other device off"
    ]
}
```
In addition to the intents that handle the main purpose of the skill, there are standard intents that can be used to handle common actions, like repeating the last response, ending a session, or handling a command that doesn't match any of the defined intents.
## Actions
To perform some kind of action in response to a command, you have to stand up a web service that can be called with a request carrying the intent the skill understood. You can build your own web service, or you can more easily use the AWS 'lambda' service to build and host it.
I chose to use lambda, and for this first round, I chose to live within the limitations of lambda's online editor.
I grabbed an example that uses the Node.js Alexa skill library as a starting point. The library handles formatting responses for me, so all I have to do is connect handlers to the right intents, and call methods like 'speak' to generate a response. For example, here's the handler for the `clapclap` intent

``` 
const ClapHandler = {
    canHandle(handlerInput) {
        console.log('in canHandle clapclap');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && (request.intent.name === 'clapclap'));
    },
    handle(handlerInput) {
        console.log('in handle clapclap');
        const speechOutput = "<speak> <audio src='https://s3.amazonaws.com/clapclap/ClapClap.mp3'/></speak>";
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .withSimpleCard(SKILL_NAME, "Clap, clap.")
            .getResponse();
        },
}; 
```

## Sound
For the actual integration, I recorded a sound snippet of my own hands clapping together twice, which I am hereby introducing into the public domain. The .mp3 file I made just needs to be publicly available, so I uploaded it to S3. Alexa is a bit picky about the format; just using a .mp3 file might not work. This StackOverflow question's answer contains one method using ffmpeg to format the file.
## Debugging
Debugging the lambda in the online editor leaves much to be desired. You basically have to resort to console.log output, and sift through the CloudFormation logs to see your messages. 
