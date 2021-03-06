'use strict';

const Boom = require('boom');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const yarpBoom = require('../index');

describe('yarp-boom', () => {
  it('should export a function', () => {
    expect(yarpBoom).to.be.a('function');
  });

  it('should return a response for a 200 level status code', () => {
    const m = nock('http://some.domain')
      .get('/some/url')
      .reply(200, { foo: 'bar' });

    return yarpBoom('http://some.domain/some/url')
      .then((resp) => {
        expect(resp).to.be.deep.equal({ foo: 'bar' });
      })
      .finally(() => {
        m.done();
      });
  });

  it('should pass along the second param to yarp', () => {
    const m = nock('http://some.domain')
      .get('/some/url')
      .reply(400, { foo: 'bar' });

    return yarpBoom('http://some.domain/some/url', true)
      .then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
        expect(resp).to.have.property('data');
        expect(resp.data).to.be.deep.equal({ foo: 'bar' });
      })
      .finally(() => {
        m.done();
      });
  });

  it('should return a boom object for a 4xx level error', () => {
    const m = nock('http://some.domain')
      .get('/some/url')
      .reply(404, Boom.notFound().output);

    return yarpBoom('http://some.domain/some/url')
      .then(() => {
        console.info('should not get here');
      })
      .catch((err) => {
        expect(err).to.have.property('isBoom', true);
        expect(err).to.have.property('message', 'Not Found');
        expect(err).to.have.property('output');
        expect(err.output).to.have.property('statusCode', 404);
      })
      .finally(() => {
        m.done();
      });
  });

  it('should return a boom object for a 5xx level error', () => {
    const m = nock('http://some.domain')
      .get('/some/url')
      .reply(500, Boom.badImplementation().output);

    return yarpBoom('http://some.domain/some/url')
      .then(() => {
        console.info('should not get here');
      })
      .catch((err) => {
        expect(err).to.have.property('isBoom', true);
        expect(err).to.have.property('message', 'Internal Server Error');
        expect(err).to.have.property('output');
        expect(err.output).to.have.property('statusCode', 500);
      })
      .finally(() => {
        m.done();
      });
  });
});
