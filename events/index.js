const chatEvents = require("./chatEvents");
const typingEvents = require("./typingEvents");

module.exports = (io, socket) => {
  chatEvents(io, socket);
  typingEvents(io, socket);
};