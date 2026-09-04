import "dotenv/config";

import app from "./src/app.js";
import http from "http";
import connectToDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

connectToDb();