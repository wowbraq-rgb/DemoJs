const http = require("http");
const fs = require("fs");
const path = require("path");

const tipos = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };

http.createServer(function (req, res) {
    const solicitud = req.url === "/" ? "index.html" : req.url.replace(/^\/+/, "");
    const raiz = path.resolve(__dirname);
    const archivo = path.resolve(raiz, solicitud);
    if (!archivo.startsWith(raiz)) { res.writeHead(403); res.end("Acceso denegado"); return; }
    fs.readFile(archivo, function (error, contenido) {
        if (error) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("Recurso no encontrado"); return; }
        res.writeHead(200, { "Content-Type": tipos[path.extname(archivo)] || "application/octet-stream" });
        res.end(contenido);
    });
}).listen(3000, function () { console.log("Demo Semana 12 en http://localhost:3000"); });
