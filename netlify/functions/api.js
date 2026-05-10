const serverless = require('serverless-http');
const app = require('../../server/src/app');

const serverlessHandler = serverless(app, {
  binary: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'multipart/form-data'],
});

module.exports.handler = async (event, context) => {
  // Netlify preserves the original request path in event.path when
  // using a redirect without :splat. Ensure /api prefix is present.
  if (event.path && !event.path.startsWith('/api')) {
    event.path = '/api' + event.path;
  }
  return serverlessHandler(event, context);
};
