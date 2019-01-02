/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const SKILL_NAME = 'My Smart Home';
const HELP_MESSAGE =
    'Welcome to Retro Home Automation.  You can say: turn on, turn off, flip the light, flip the other device, turn the light on, turn the alternate light off... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'It has been my pleasure to serve you.';
const FALLBACK_MESSAGE = 'The ' + SKILL_NAME + " skill can't help you with that.  What can I help you with?";
const FALLBACK_REPROMPT = 'What can I help you with?';

const ClapHandler = {
    canHandle(handlerInput) {
        console.log('canhandle clapclap');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return (
            request.type === 'LaunchRequest' ||
            (request.type === 'IntentRequest' && (request.intent.name === 'toggle' || request.intent.name === 'clapclap'))
        );
    },
    handle(handlerInput) {
        console.log('handle clapclap');
        const speechOutput = "<speak> <audio src='https://s3.amazonaws.com/clapclap/ClapClap.mp3'/></speak>";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .withSimpleCard(SKILL_NAME, 'Clap, clap.')
            .getResponse();
    }
};

const ClapClapClapHandler = {
    canHandle(handlerInput) {
        console.log('canhandle clapclapclap');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return (
            request.type === 'LaunchRequest' || (request.type === 'IntentRequest' && request.intent.name === 'clapclapclap')
        );
    },
    handle(handlerInput) {
        console.log('handle clapclapclap');
        const speechOutput = "<speak> <audio src='https://s3.amazonaws.com/clapclap/clapclapclap.mp3'/></speak>";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .withSimpleCard(SKILL_NAME, 'Clap, clap, clap.')
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        console.log('canhandle end');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope.request, null, 4)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        console.log('canhandle help');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        console.log('handle help');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .withSimpleCard(SKILL_NAME, HELP_MESSAGE)
            .reprompt(HELP_REPROMPT)
            .getResponse();
    }
};

const FallbackHandler = {
    // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
    //              This handler will not be triggered except in those locales, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
        console.log('canhandle fallback');
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log('handle fallback');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt(FALLBACK_REPROMPT)
            .getResponse();
    }
};
const ExitHandler = {
    canHandle(handlerInput) {
        console.log('canhandle exit');
        const request = handlerInput.requestEnvelope.request;
        console.log('type:', request.type, 'intent:', request.intent);
        return (
            request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
        );
    },
    handle(handlerInput) {
        console.log('handle exit');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        console.log('canhandle error');
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, an error occurred.')
            .reprompt('Sorry, an error occurred.')
            .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        ClapHandler,
        ClapClapClapHandler,
        HelpHandler,
        ExitHandler,
        FallbackHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
