'use strict';

const Assert = require('assert');

exports.register = function (server, options, next) {

  Assert(server.realm.modifiers.route.vhost, 'Must specify one or more vhosts');

  const vhosts = [].concat(server.realm.modifiers.route.vhost);

  server.ext('onRequest', (request, reply) => {

    if (request.headers.host &&
        vhosts.includes(request.headers.host) &&
        request.headers['x-forwarded-proto'] &&
        request.headers['x-forwarded-proto'] !== 'https') {

      return reply().header('location', `https://${request.headers.host}${request.raw.req.url}`).code(307);
    }

    return reply.continue();
  });

  return next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
