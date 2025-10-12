#!/usr/bin/env node
/*
  Script: assign-sl-no.mjs

  Usage (PowerShell):
    node scripts/assign-sl-no.mjs --serviceAccount ./serviceAccount.json --collection alumni --createdAtField createdAt --slNoField sl_no --start 1 --dry-run

  Notes:
  - If `createdAt` is stored as a Firestore Timestamp this script will use server-side ordering.
  - If `createdAt` is stored as a string, the script will fetch documents and sort by parsing the string as a Date.
  - The script supports a dry-run mode that prints planned updates without writing.
  - Commits are performed in batches of up to 500 writes.
*/

import admin from 'firebase-admin';
import fs from 'fs';
import readline from 'readline';

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

function askYesNo(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question + ' ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'yes' || answer.trim().toLowerCase() === 'y');
    });
  });
}

async function main() {
  const args = parseArgs();
  const serviceAccount = args.serviceAccount || args.sa;
  const collectionName = args.collection || 'alumni';
  const createdAtField = args.createdAtField || 'createdAt';
  const slNoField = args.slNoField || 'sl_no';
  const startNumber = Number(args.start || 1);
  const dryRun = !!args['dry-run'] || !!args.dryRun;
  const limit = args.limit ? Number(args.limit) : undefined;

  if (serviceAccount && !fs.existsSync(serviceAccount)) {
    console.error('Service account file not found at', serviceAccount);
    process.exit(1);
  }

  // Initialize admin SDK
  if (serviceAccount) {
    const sa = JSON.parse(fs.readFileSync(serviceAccount, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else if (!admin.apps.length) {
    // Try application default credentials
    admin.initializeApp();
  }

  const db = admin.firestore();
  console.log(`Collection: ${collectionName}, createdAtField: ${createdAtField}, slNoField: ${slNoField}, start: ${startNumber}, dryRun: ${dryRun}`);

  // Attempt to query ordered by createdAt - this works if createdAt is Firestore Timestamp and consistent type.
  let docs = [];
  try {
    const colRef = db.collection(collectionName);
    const snapshot = await colRef.orderBy(createdAtField, 'asc').get();
    docs = snapshot.docs.map((d) => ({ id: d.id, ref: d.ref, data: d.data() }));
    console.log(`Fetched ${docs.length} documents using server-side orderBy.`);
    // If limit provided, slice to first N
    if (limit) docs = docs.slice(0, limit);
  } catch (err) {
    console.warn('Server-side orderBy failed (likely because createdAt is not a consistent Firestore Timestamp). Falling back to client-side sorting. Error:', err.message || err);
    // fetch all docs and sort client-side
    const snapshot = await db.collection(collectionName).get();
    docs = snapshot.docs.map((d) => ({ id: d.id, ref: d.ref, data: d.data() }));
    console.log(`Fetched ${docs.length} documents for client-side sorting.`);
    if (limit) docs = docs.slice(0, limit);
    docs.sort((a, b) => {
      const va = a.data[createdAtField];
      const vb = b.data[createdAtField];
      function toDate(v) {
        if (!v) return new Date(0);
        // Firestore Timestamp-like
        if (typeof v.toDate === 'function') return v.toDate();
        if (typeof v === 'number') return new Date(v);
        if (typeof v === 'string') return new Date(v);
        if (v.seconds) return new Date(v.seconds * 1000);
        return new Date(0);
      }
      return toDate(va) - toDate(vb);
    });
  }

  if (docs.length === 0) {
    console.log('No documents found. Exiting.');
    return;
  }

  // Show a preview of the first few updates
  console.log('Preview (first 10):');
  for (let i = 0; i < Math.min(10, docs.length); i++) {
    const doc = docs[i];
    const index = startNumber + i;
    console.log(`${i + 1}. docId=${doc.id} => ${slNoField} = ${index}`);
  }

  if (!dryRun) {
    const ok = await askYesNo('Proceed to write sl_no values to Firestore? Type yes to continue:');
    if (!ok) {
      console.log('Aborted by user.');
      process.exit(0);
    }
  }

  // Prepare batch writes
  const BATCH_LIMIT = 500;
  let batch = db.batch();
  let opCount = 0;
  let current = startNumber;
  let written = 0;

  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];
    const value = current;
    if (dryRun) {
      console.log(`DRY RUN: would set ${d.ref.path} -> ${slNoField} = ${value}`);
    } else {
      batch.update(d.ref, { [slNoField]: value });
      opCount++;
      if (opCount >= BATCH_LIMIT) {
        console.log(`Committing batch of ${opCount} updates...`);
        await batch.commit();
        written += opCount;
        batch = db.batch();
        opCount = 0;
      }
    }
    current++;
  }

  if (!dryRun && opCount > 0) {
    console.log(`Committing final batch of ${opCount} updates...`);
    await batch.commit();
    written += opCount;
  }

  console.log(dryRun ? 'Dry-run complete. No writes were performed.' : `Done. Updated ${written} documents.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
