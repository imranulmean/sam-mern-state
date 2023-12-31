import { signup, signin, google } from './authController.mjs';
import { createListing, getListings, getListing, updateListing } from './listing.controller.mjs';
import { getUserListings, updateUser } from './user.controller.mjs';
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://imranulhasan73:rantu@cluster0.vqhondi.mongodb.net/?retryWrites=true&w=majority"; // Get the connection string from environment variables
let isConnected = false;
export const lambdaHandler = async (event, context) => {
    let response;
    let finalRes={
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body:"helow from lambda"
    }
    try {
        context.callbackWaitsForEmptyEventLoop = false; // Allows the Lambda function to reuse database connections
        if (!isConnected) {
            await mongoose.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            isConnected = true;
        }  
    
        // ----------------------
        const jsonParseEventBody=JSON.parse(event.body);
      const customerId = event.pathParameters.customerId;
        if(!customerId){
          if(event.queryParam==="signUp"){
            response= await signup(event);
          }
          if(jsonParseEventBody.queryParam==="signIn"){
            response= await signin(jsonParseEventBody);
          }
          if(jsonParseEventBody.queryParam==="createListing"){
            response= await createListing(event);
          } 
      
          if(jsonParseEventBody.queryParam==="getUserListings"){
            response= await getUserListings(jsonParseEventBody);
          }
          
          if(jsonParseEventBody.queryParam==="getListings"){
            response= await getListings(event);
          }
          
          if(jsonParseEventBody.queryParam==="google"){
            response= await google(event);
          }       
        }
        if(customerId){
          jsonParseEventBody.customerId=customerId;
          if(jsonParseEventBody.queryParam==="updateUser"){
            response= await updateUser(jsonParseEventBody);
          // response=event;
          }
          
          if(jsonParseEventBody.queryParam==="getListing"){
            response= await getListing(jsonParseEventBody);
          }
          
          if(jsonParseEventBody.queryParam==="updateListing"){
            response= await updateListing(event);
          }      
        }
       finalRes.body=JSON.stringify(response);
      //finalRes.body=JSON.stringify(event);
        return finalRes;        
    } catch (error) {
        return error;
    }

};
