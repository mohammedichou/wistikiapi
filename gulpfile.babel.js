const requireDir = require('require-dir');

requireDir('./tasks');
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
