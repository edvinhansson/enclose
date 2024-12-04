import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  devices: a
    .model({
      device_id: a.string().required(),
      owner: a.string().required(),
      status: a.string(),
      humidity: a.integer(),
    })
    .identifier(['device_id'])
    .authorization((allow) => [allow.owner(), allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
