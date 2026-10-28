import { DatabaseSync } from 'node:sqlite';
import { initialiseMailQueue,processAuthMail } from './auth-mail-core.mjs';

// Run independently of page traffic; pending jobs remain in the persistent database.
await new Promise(resolve=>setTimeout(resolve,10_000));
let db;
let warned=false;
for(;;){
  try {
    if(!db){db=new DatabaseSync(process.env.DATABASE_PATH || './data/cvmais.sqlite');
      db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');initialiseMailQueue(db);
      console.log('Authentication email queue worker started.');}
    await processAuthMail(db,{worker:true});warned=false;
  }catch{if(!warned)console.error('Authentication email queue could not run; check storage and mail configuration.');warned=true;}
  await new Promise(resolve=>setTimeout(resolve,2000));
}
