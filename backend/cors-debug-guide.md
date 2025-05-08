
# CORS Debugging Guide for Sagebright Backend

## Manual Testing

Use the following curl command to test preflight responses:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://sagebright-auth-update.lovable.app" \
  -H "Access-Control-Request-Method: GET" \
  https://sagebright-backend.up.railway.app/api/auth/session
```

### Expected Response Headers:

```
HTTP/2 204
access-control-allow-origin: https://sagebright-auth-update.lovable.app
access-control-allow-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
access-control-allow-headers: Content-Type,Authorization,X-Requested-With,Accept,Cache-Control
access-control-allow-credentials: true
access-control-max-age: 86400
```

## Common CORS Issues

1. **Incorrect CORS configuration**: Make sure CORS middleware is properly applied and configured
2. **CORS applied in wrong order**: CORS middleware must be applied before any routes
3. **Missing preflight handler**: Make sure `app.options('*', cors())` is present
4. **Proxy server overriding headers**: Check if Railway or other infrastructure is removing/modifying CORS headers

## Railway-specific Notes

Railway may need additional environment configuration:

1. Check if Railway has any special environment variables for CORS
2. Ensure your Railway deployment isn't behind an additional proxy that strips headers
3. Verify that your deployment process includes the latest CORS configuration

## Debugging Steps

1. Add extensive logging to confirm requests are being received with expected origins
2. Verify response headers using browser network inspector
3. Test with a simpler CORS setup first (allow all origins temporarily)
4. Check if credentials mode is causing issues (try with and without)

## Quick Test Endpoint

Add this route to quickly verify CORS is working:

```javascript
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    time: new Date().toISOString()
  });
});
```
