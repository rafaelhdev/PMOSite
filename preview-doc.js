const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('C:/Users/rv.teixeira/Desktop/PMOsite/preview.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(3456, () => console.log('Servidor rodando na porta 3456'));
