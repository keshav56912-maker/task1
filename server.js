const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const MESSAGE_FILE = path.join(__dirname, "message");
const FORM_FILE = path.join(__dirname, "index.html");

if (!fs.existsSync(MESSAGE_FILE)) {
  fs.writeFileSync(MESSAGE_FILE, "");
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.readFile(FORM_FILE, "utf8", (formError, html) => {
      if (formError) {
        res.writeHead(500);
        return res.end("Could not load the form.");
      }

      fs.readFile(MESSAGE_FILE, "utf8", (fileError, content) => {
        if (fileError) {
          res.writeHead(500);
          return res.end("Could not read messages.");
        }

        const messages = content
          .split("\n")
          .filter((message) => message.trim() !== "")
          .reverse();

        const messageList = messages
          .map((message) => `<div class="message">${escapeHTML(message)}</div>`)
          .join("");

        html = html.replace("<!-- MESSAGES -->", messageList);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
    });
    return;
  }

  if (req.method === "POST" && req.url === "/message") {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));

    req.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf8");
      const params = new URLSearchParams(body);
      const message = (params.get("message") || "").trim();

      if (!message) {
        res.writeHead(302, { Location: "/" });
        return res.end();
      }

      fs.appendFile(MESSAGE_FILE, message + "\n", (error) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("Could not save the message.");
        }

        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 - Page Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
