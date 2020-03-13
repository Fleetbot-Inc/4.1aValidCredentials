'use strict'
const endpoints = require('@source4society/scepter-endpoints')
const Authentication = require('../../library/fleetbot-authentication/')
const { PublicEndpoint } = endpoints
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

const errors = {
  credentials: {
    code: 403,
    message: 'Invalid credentials'
  },
  arguments: {
    code: 400,
    message: 'Username and hashPass must be provided in post data'
  },
  default: {
    code: 500,
    message: 'An unexpected error has occurred'
  }
}

const version = 'v1'

module.exports.validCredentials_v1 = (event, context, callback) => {
  let code = 500
  const endpoint = new PublicEndpoint(event, context, callback)
  try {
    const authentication = new Authentication()
    const params = endpoint.utilities.getInOrDefault(event, ['body'], null)
    if (params === null) { throw new Error('arguments') }
    const decodedParams = JSON.parse(params)
    const { username, hashPass, remember } = decodedParams
    const jwt = authentication.validateCredentials(username, hashPass, remember)
    if (jwt === false) { throw new Error('credentials') }
    code = 200
    const payload = {
      payload: {
        result: {
          success: true,
          code
        },
        jwt,
      },
      version,
    }
    endpoint.successResponse(payload, headers, code)
  } catch (exception) {
    let errorKey = endpoint.utilities.getInOrDefault(exception, ['message'], 'default')
    errorKey = endpoint.utilities.ifTrueElseDefault(Object.keys(errors).includes(errorKey), errorKey, 'default')
    const error = errors[errorKey]
    const payload = {
      payload: {
        result: {
          success: false,
          exception: {
            code: error.code,
            message: error.message
          },
        }
      },
      version,
    }
    endpoint.errorResponse(payload, headers, error.code)
  }
}
