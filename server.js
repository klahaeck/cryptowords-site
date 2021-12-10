const next = require('next');
const express = require('express');
// const sslRedirect = require('heroku-ssl-redirect');
const auth = require('basic-auth');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const nextConfig = require('./next.config');

app.prepare().then(async () => {
  const server = express();

  // server.use(function (req, res, next) {
  //   if (req.headers.host !== 'localhost:3000' && req.headers.host !== 'arbysfry.app') {
  //     res.redirect('https://arbysfry.app' + req.url);
  //   } else {
  //     next();     
  //   }
  // });

  // server.use(sslRedirect.default());

  // server.use(function (req, res, next) {
  //   const credentials = auth(req);

  //   if ((!credentials || credentials.name !== process.env.BASIC_AUTH_USER || credentials.pass !== process.env.BASIC_AUTH_PASS) && process.env.IS_LIVE !== 'true') {
  //     res.status(401);
  //     res.header('WWW-Authenticate', 'Basic realm="example"');
  //     res.send('Access denied');
  //   } else {
  //     next();
  //   }
  // });

  server.use(express.static(__dirname + '/public', { maxAge: '1h' }));
  server.use(function (req, res, next) {
    if (req.url.match('.js|.css|.woff|.jpg|.png|.gif|.svg|.ttf|.otf|.json|.bin')) {
      res.setHeader('Cache-Control', 'public,max-age=3600'); // 1 hour
    }
    next();
  });

  // const redirects = await nextConfig.redirects();

  // redirects.forEach(({ source, destination, permanent = false, method = 'get' }) => {
  //   const type = permanent ? 301 : 302;
  //   server[method](source, (req, res) => {
  //     res.redirect(type, destination)
  //   });
  // });

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    if (dev) console.log(`> Ready on port: ${port}`);
  });
});