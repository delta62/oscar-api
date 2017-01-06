exports.uptimePlugin = function uptimePlugin(server) {
  server.startedAt = +new Date();
  server.uptime = function uptime() {
    let now = +new Date();
    return Math.floor((now - server.startedAt) / 1000);
  };
};
