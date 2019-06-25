const pm2 = require('pm2');
const fs = require('fs');
const COMPILER = "eosio compiler";
const EXPLORER = "eosio explorer";

const displayStatus = (app) => {
    if (app.pm2_env.status === "online") {
      console.log("\x1b[34m" + app.pm2_env.name + "\x1b[0m ---- \x1b[32m" + app.pm2_env.status + "\x1b[0m");
    }
    else {
      console.log("\x1b[34m" + app.pm2_env.name + "\x1b[0m ---- \x1b[31m" + app.pm2_env.status + "\x1b[0m");
      console.log("\x1b[31msomething went wrong please use \"pm2 logs\" to check the logs\x1b[0m")
    }
}

const startPm2 = () =>{
  console.log("\x1b[36mstarting app and compiler using pm2\x1b[0m");
  
  if (fs.existsSync(process.argv.slice(2)[0])) {
    pm2.start({
      name      : COMPILER,
      script    : 'yarn start',
      cwd: process.argv.slice(2)[0]
    }, function(err, app) {
      if (err) throw err
      displayStatus(app[0]);
    });
  }
  else
    console.log ("\x1b[31merror finding compiler path\x1b[0m");

  pm2.start({
    name      : EXPLORER,
    script    : 'serve.js',         // Script to be run
    args: [process.argv.slice(2)[1]]
  }, function(err, app) {
    if (err) throw err
    displayStatus(app[0]);
  });
}

const deletePm2 = (list) =>{
  let delete_count = 0;
  list.forEach((app) =>{
    pm2.delete(app.pm2_env.pm_id, (err, res)=> {
      delete_count++;
      if(delete_count === list.length){
        startPm2();
      }
    });
  });
}

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  // clearing the already running pm2 instances before starting
  pm2.list((err, apps)=>{
    if(err)
      console.log("error encountered while fetching pm2 list-> ", err);
    else { 
      if(apps.length > 0){
        let deleteList = [];
        apps.forEach((app, index)=>{          
          if(app.pm2_env.name === EXPLORER || app.pm2_env.name === COMPILER){
            deleteList.push(app); 
          }
          if(index === apps.length-1){
            if(deleteList.length > 0)
              deletePm2(deleteList);
            else
              startPm2();              
          }              
        });           
      }else{
        startPm2();
      }         
    }
  });
});
