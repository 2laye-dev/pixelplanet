process.env.NODE_ENV ||= 'production';
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(__dirname, process.env.NODE_ENV !== 'production');
const http = require('node:http');
const next = require('next');
const app = next({ dev: false, dir: __dirname });
const handler = app.getRequestHandler();
app.prepare().then(() => {
  http.createServer((req, res) => handler(req, res)).listen(process.env.PORT || 3000, () => console.log('Pixel Planet ready'));
}).catch(error => { console.error(error); process.exit(1); });
