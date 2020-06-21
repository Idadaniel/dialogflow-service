const express = require('express');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


 

async function detectIntent(text) {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath('faq-kyxebb', sessionId);
 
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en-US',
      },
    },
  };
 
 try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result.fulfillmentText;
 } catch (error) {
     return null;
 }
 
}

app.post('/', async(req, res) => {
    try {
        const response = await detectIntent(req.body.text);

        

        if(response) {
            return res.send({response});
        } else {
            return res.status(500).send({message: 'Server Error', error: error.stack});
        }
        
    } catch (error) {
        return res.status(500).send({message: 'Server Error', error: error.stack});
    }
  });

  app.listen(process.env.PORT || 5000, () =>
  console.log(`Dialog flow service listening on port ${process.env.PORT || 5000}!`),
);