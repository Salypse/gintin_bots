## Slappy

Redirect http to https for specific vhosts based on the `X-Forwarded-Proto` header.

### example

```js
server.register([require('slappy')], { routes: { vhost: 'example.com' } }, (err) => { // vhost can be a string or array of strings

  server.start();
});
```

Any requests received by the above server with a `Host` header matching `example.com` and an `X-Forwarded-Proto` header with a value of `http` will be `307` redirected to the same host and URL with the `https` protocol.

If the `Host` or `X-Forwarded-Proto` headers do not match or are not supplied, no action is taken.
