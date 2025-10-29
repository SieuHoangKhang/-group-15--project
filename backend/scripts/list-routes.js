const path = require('path');
function listRouter(router) {
  if (!router || !router.stack) return [];
  return router.stack
    .map(s => {
      if (s.route && s.route.path) {
        const methods = Object.keys(s.route.methods).map(m => m.toUpperCase()).join(',');
        return `${methods} ${s.route.path}`;
      }
      return `MIDDLEWARE ${s.name || '(anonymous)'}`;
    })
    .filter(Boolean);
}

try {
  const auth = require(path.join(__dirname, '..', 'routes', 'auth'));
  console.log('--- auth routes ---');
  console.log(listRouter(auth).join('\n'));
} catch (e) {
  console.error('Failed to load auth router:', e.message);
}

try {
  const debug = require(path.join(__dirname, '..', 'routes', 'debug'));
  console.log('\n--- debug routes ---');
  console.log(listRouter(debug).join('\n'));
} catch (e) {
  console.error('Failed to load debug router:', e.message);
}
