'use strict';

const Boom = require('boom');
const yarp = require('yarp');

const onError = (err) => {
  /* istanbul ignore else */
  if (err.statusCode && err.data) {
    throw new Boom(err.data.message, { statusCode: err.statusCode });
  } else {
    throw err;
  }
};

module.exports = (...options) => {
  return yarp(...options).catch(onError);
};
