'use strict';

const yarp = require('yarp');
const Boom = require('boom');

const onError = function(err) {
  /* istanbul ignore else */
  if (err.statusCode && err.data) {
    throw Boom.create(err.statusCode, err.data.message);
  } else {
    throw err;
  }
};

module.exports = function(...options) {
  return yarp(...options).catch(onError);
};
