const sseClients = new Map();

const setupSSE = (app) => {
  // console.log("SSE Setup done");

  app.get("/api/v1/chat/sse/:conversationId", (req, res) => {
    const conversationId = req.params.conversationId;
    // console.log("SSE 1 : ", conversationId)
    // Set headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Store the client connection
    if (!sseClients.has(conversationId)) {
      sseClients.set(conversationId, new Set());
    }
    sseClients.get(conversationId).add(res);
    // console.log("SSE 2 : ", sseClients)

    // Remove client on connection close
    req.on("close", () => {
      sseClients.get(conversationId)?.delete(res);
      if (sseClients.get(conversationId)?.size === 0) {
        sseClients.delete(conversationId);
      }
    });
  });
};

const sendSSEUpdate = (conversationId, message) => {
  // console.log("Inside sse update : ", conversationId);
  const clients = sseClients.get(conversationId);
  // console.log("Client : ", clients);
  if (clients) {
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
};

module.exports = { setupSSE, sendSSEUpdate };
