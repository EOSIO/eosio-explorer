var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    script    : 'serve.js',         // Script to be run
    exec_mode : 'cluster',        // Allows your app to be clustered
    instances : 4                // Optional: Scales your app by 4
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });
});
