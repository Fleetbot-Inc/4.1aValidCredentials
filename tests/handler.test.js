describe('handler.js - validCredentials_v1', () => {
  const successfulPost = require('../examples/success.json')
  const invalidPost = require('../examples/invalid.json')
  let handler = null
  const version = "v1"
  beforeEach(() => {
    handler = require('../handler')
  });

  it('should export validCredentials_v1 function', () => {
    expect(typeof handler.validCredentials_v1).not.toBe('undefined')
  })

  it('should return a valid error response when invalid arguments are posted', (done) => {
    const mockCallback = (response) => {      
      expect(response.statusCode).toEqual(400)
      const data = JSON.parse(response.body)
      expect(data.payload.result.exception.message).toEqual('Username and hashPass must be provided in post data')
      expect(data.version).toEqual(version)
      done()
    }
    const errorResponse = handler.validCredentials_v1('', '', mockCallback)
  })

  it('should return an invalid credentials response when invalid credentials are posted', (done) => {
    const mockCallback = (response, success) => {
      expect(typeof success).toBe('undefined')
      expect(response.statusCode).toEqual(403)
      const data = JSON.parse(response.body)
      expect(data.payload.result.exception.message).toEqual('Invalid credentials')
      expect(data.version).toEqual(version)
      done()
    }
    const errorResponse = handler.validCredentials_v1(invalidPost, '', mockCallback)
  })

  it('should return a response with a JWT when valid credentials are posted', (done) => {
    const mockCallback = (error, response) => {      
      expect(error).toBe(null)
      expect(response.statusCode).toEqual(200)
      const data = JSON.parse(response.body)
      expect(data.payload.result.success).toEqual(true)
      expect(data.payload.jwt).toEqual('mockjwt')
      expect(data.version).toEqual(version)
      done()
    }
    const errorResponse = handler.validCredentials_v1(successfulPost, '', mockCallback)
  })
})