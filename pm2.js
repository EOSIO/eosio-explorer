const pm2 = require('pm2');
const fs = require('fs');

const displayStatus = (app) => {
  //apps.forEach(app=>{
    if (app.pm2_env.status === "online") {
      console.log("\x1b[34m" + app.pm2_env.name + "\x1b[0m ---- \x1b[32m" + app.pm2_env.status + "\x1b[0m");
    }
    else {
      console.log("\x1b[34m" + app.pm2_env.name + "\x1b[0m ---- \x1b[31m" + app.pm2_env.status + "\x1b[0m");
      console.log("\x1b[31msomething went wrong please use \"pm2 logs\" to check the logs\x1b[0m")
    }
  //});
}

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  console.log("\x1b[36mstarting app and compiler using pm2\x1b[0m");
  if (fs.existsSync(process.argv.slice(2)[0])) {
    pm2.start({
      name      : "eosio compiler",
      script    : 'yarn start',
      cwd: process.argv.slice(2)[0]
    }, function(err, app) {
      displayStatus(app[0]);
      if (err) throw err
    });
  }
  else
    console.log ("\x1b[31merror finding compiler path\x1b[0m");

  pm2.start({
    name      : "eosio explorer",
    script    : 'serve.js'         // Script to be run
  }, function(err, app) {
    displayStatus(app[0]);
    if (err) throw err
  });
});
