const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    const body = [];
    
    if(url==='/') {
        fs.readFile('message.txt', { encoding: 'utf-8'}, (err, data) => {
            if(err) {
                console.log(err);
            }
            res.write('<html>');
            res.write('<head><title>Enter message</title></head>');
            res.write('<body>');
            res.write(`<p>${data}</p>`);
            res.write('<form action="/message" method="POST">');
            res.write('<input type="text" name="message"></input>');
            res.write('<button type="submit">Send</button>');
            res.write('</form>');
            res.write('</body>');
            res.write('</html>');
            return res.end();
        });
    } else if (url==='/message' && method === 'POST') {
        req.on('data', (chunk) => {
            body.push(chunk)
        })

        return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFile('message.txt', message, (err) => {
                if(err) {
                    console.log(err)
                }
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    else {
        res.setHeader('Content-Type', 'text/html');
        res.write('html');
        res.write('<head><title>My first page</title></head>')
        res.write('<body><h1>Hello from node js</h1></body>')
        res.end();
    }
});
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
