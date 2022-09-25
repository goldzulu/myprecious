// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const dotenv = require('dotenv').config();
const axios = require('axios');
const { S3PersistenceAdapter } = require('ask-sdk-s3-persistence-adapter');


const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const SHORT_URL = process.env.SHORT_URL; // url to redirect the user to
const URL= process.env.URL; // url for api calls to backend server
const DEFAULT_CHAIN_ID = process.env.DEFAULT_CHAIN_ID;
const DEFAULT_WALLET_ADDRESS = process.env.DEFAULT_WALLET_ADDRESS;
const DEFAULT_ENS_ADDRESS = process.env.DEFAULT_ENS_ADDRESS;


let walletData = {};
let persistenceAdapter = new S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET});

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {

        let {attributesManager} = handlerInput;
        let persistentAttributes = await attributesManager.getPersistentAttributes();
       
        console.log("persistentAttributes: ", persistentAttributes);
        if (!persistentAttributes.hasOwnProperty('walletData')) 
        {
            console.log("No persistence attributes found... setting defaults");
            // set defaults if not available
            persistentAttributes = {
                defaultWalletAddress: DEFAULT_WALLET_ADDRESS,
                defaultChainId: DEFAULT_CHAIN_ID,
                defaultEnsAddress: DEFAULT_ENS_ADDRESS
            };

            attributesManager.setPersistentAttributes(persistentAttributes);
            await attributesManager.savePersistentAttributes();
            walletData=persistentAttributes;
            console.log(walletData);
        }

        else {
            console.log("persistence attributes found");
            walletData=persistentAttributes;
            console.log(walletData);
        }

        const speakOutput = 'Welcome. I am your precious web3 voice wallet. Which would you like to know?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const CheckNativeBalanceHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckNativeBalanceIntent';
    },
    async handle(handlerInput) {

        console.log("walletData: ", walletData);
        // use axios to fetch data from covalenthq
        const response = await axios.get(`https://api.covalenthq.com/v1/${walletData.defaultChainId}/address/${walletData.defaultWalletAddress}/balances_v2/`, {
            params: {
                'quote-currency': 'USD',
                'format':'JSON',
                'nft':'false',
                'no-nft-fetch':'true',
                'key':`${COVALENT_API_KEY}`
            }
        });

        let tokens = response.data.data.items;

        console.log(tokens);
        let speakOutput = '';

        tokens.map(async function(token) { // Map through the results and for each run the code below
            if (token.native_token === true ) {
                if (token.contract_decimals > 0) {
                    balance = parseInt(token.balance) / Math.pow(10, token.contract_decimals);
                } else {
                    balance = parseInt(token.balance);
                }
                speakOutput = `You have ${balance.toFixed(4)} ${token.contract_name} in your wallet, worth ${parseFloat(token.quote).toFixed(2)} USD.`;
            }
        });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const CheckNativeENSBalanceHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckNativeENSBalanceIntent';
    },
    async handle(handlerInput) {
        // use axios to fetch data from covalenthq
        console.log("ENS Wallet Ballance: ");
        
        console.log("walletData: ", walletData);

        const response = await axios.get(`https://api.covalenthq.com/v1/1/address/${walletData.defaultEnsAddress}/balances_v2/`, {
            params: {
                'quote-currency': 'USD',
                'format':'JSON',
                'nft':'false',
                'no-nft-fetch':'true',
                'key':`${COVALENT_API_KEY}`
            }
        });

        let tokens = response.data.data.items;

        console.log(tokens);
        let speakOutput = '';

        tokens.map(async function(token) { // Map through the results and for each run the code below
            if (token.native_token === true ) {
                if (token.contract_decimals > 0) {
                    balance = parseInt(token.balance) / Math.pow(10, token.contract_decimals);
                } else {
                    balance = parseInt(token.balance);
                }
                speakOutput = `You have ${balance.toFixed(4)} ${token.contract_name} in your wallet, worth ${parseFloat(token.quote).toFixed(2)} USD.`;
            }
        });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        CheckNativeENSBalanceHandler,
        CheckNativeBalanceHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .withPersistenceAdapter(
        persistenceAdapter
    )
    .lambda();
