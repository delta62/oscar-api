exports.uptime = function uptime(since, until) {
  return Math.floor((until - since) / 1000);
};
