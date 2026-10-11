# Node.js Message Form and Chat App

This project demonstrates reading and writing messages to a file using Node.js.

## Files
- `server.js` — HTTP server, request stream, Buffer, file read/write, and 302 redirect.
- `index.html` — chat form.
- `message` — saved messages, one per line.

## Run locally
1. Install Node.js.
2. Open a terminal in this folder.
3. Run `node server.js`.
4. Visit http://localhost:3000.

## How it works
- `req.on("data")` receives request-body chunks.
- `Buffer.concat(chunks)` combines the chunks.
- `fs.appendFile()` saves each message.
- `fs.readFile()` reads all saved messages.
- Messages are reversed before display so the newest appears first.
- `res.writeHead(302, { Location: "/" })` redirects to the home page.

## Deploying
Push this repository to GitHub, then deploy it using a Node.js hosting service such as Render. GitHub Pages alone cannot run this Node.js server or persist writes to the `message` file.
