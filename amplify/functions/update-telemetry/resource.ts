import { defineFunction, secret } from "@aws-amplify/backend";

export const updateTelemetry = defineFunction({
    environment: {
        GRAPHQL_ENDPOINT: secret('GRAPHQL_ENDPOINT'),
        GRAPHQL_API_KEY: secret('GRAPHQL_API_KEY'),
        PUSHOVER_USER: secret('PUSHOVER_USER'),
        PUSHOVER_TOKEN: secret('PUSHOVER_TOKEN'),
    },

    name: 'update-telemetry',
    entry: './handler.ts',
});
