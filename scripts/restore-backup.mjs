import { decryptSnapshot } from './backup-core.mjs';
const [source, target] = process.argv.slice(2);
if (!source || !target) throw new Error('Usage: node scripts/restore-backup.mjs encrypted.cvb NEW-isolated-database.sqlite');
await decryptSnapshot(source, target, process.env.BACKUP_ENCRYPTION_KEY);
console.log('Backup decrypted and database integrity verified. Reconcile later erasure requests before production recovery.');
