import type { Handler } from 'aws-lambda';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT as string;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY as string;
const PUSHOVER_USER = process.env.PUSHOVER_USER as string;
const PUSHOVER_TOKEN = process.env.PUSHOVER_TOKEN as string;

var Push = require('pushover-notifications');

const query = `
    mutation UPDATE_DEVICES($input: UpdateDevicesInput!) {
        updateDevices(input: $input) {
            device_id
            status
            owner
            createdAt
            updatedAt
            humidity
        }
    }
`;

export const handler: Handler = async (event, context) => {
    console.log(`EVENT : ${JSON.stringify(event)}`);

    /* check if we need to notify owner of humidity; hardcoded for now */
    const threshold = 60;
    if (event.humidity >= threshold) {
        console.log(`humidity ${event.humidity} over threshold of >=${threshold}`);
        
        var client = new Push({
            user: PUSHOVER_USER,
            token: PUSHOVER_TOKEN
        });

        var msg = {
            title: 'Enclose ALERT',
            message: `Humidity (${event.humidity}%) is >= threshold (${threshold}%)`,
        };

        client.send(msg, function(err: any, result: any) {
            if (err) {
                throw err;
            }
        });
    }

    const variables = {
        input: {
            device_id: event.device_id,
            humidity: event.humidity,
        }
    };
    const options = {
        method: 'POST',
        headers: {
            'x-api-key': GRAPHQL_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables })
    };

    const request = new Request(GRAPHQL_ENDPOINT, options);
    console.log('request', request);

    let statusCode = 200;
    let body;
    let response;

    try {
        response = await fetch(request);
        console.log('response', response);
        body = await response.json();
        console.log('body', body);
        if (body.errors) statusCode = 400;
    } catch (error) {
        statusCode = 400;
        body = {
            errors: [
                {
                    status: response?.status,
                    error: JSON.stringify(error)
                }
            ]
        };
    }


    return {
        statusCode,
        body: JSON.stringify(body)
    };
};
