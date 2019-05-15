var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start({
    name      : "eosio compiler",
    script    : 'yarn start',
    cwd: process.argv.slice(2)[0]
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });

  pm2.start({
    name      : "eosio explorer",
    script    : 'serve.js'         // Script to be run
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });

  pm2.list((err, apps)=>{
    if(err)
      console.log("error encountered -> ", err);
    else {
      console.log("\x1b[36mstarting app and compiler using pm2\x1b[0m");
      apps.forEach(app=>{
        if (app.pm2_env.status === "online")
          console.log("\x1b[34m" + app.name + "\x1b[0m ---- \x1b[32m" + app.pm2_env.status + "\x1b[0m");
        else 
        console.log("\x1b[34m" + app.name + "\x1b[0m ---- \x1b[31m" + app.pm2_env.status + "\x1b[0m");
      })
    }
  });

});
