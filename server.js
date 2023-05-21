const app = require("./app");
const http = require("http");

const PORT = 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});
