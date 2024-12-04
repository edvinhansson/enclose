import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { updateStatus } from './functions/update-status/resource';
import { updateTelemetry } from './functions/update-telemetry/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
    auth,
    data,
    updateStatus,
    updateTelemetry,
});
