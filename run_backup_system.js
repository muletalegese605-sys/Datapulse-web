const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyAb1Fbs8Y36BZ8rnIUZBjocc-m0Em_PgcQ",
  authDomain: "datapulseapp-20237.firebaseapp.com",
  databaseURL: "https://datapulseapp-20237-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "datapulseapp-20237",
  storageBucket: "datapulseapp-20237.firebasestorage.app",
  messagingSenderId: "459433026519",
  appId: "1:459433026519:web:102f1f951bcb91d306e192",
  measurementId: "G-RFN5ZZTE6W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runAutomatedBackup() {
  console.log("\n==================================================");
  console.log("DataPulse Automated Backup System Started");
  console.log("==================================================\n");

  const collectionsToBackup = ["cleaned_business_records", "launch_readiness_audit"];
  const backupData = {
    timestamp: new Date().toISOString(),
    system: "DataPulse Enterprise",
    collections: {}
  };

  for (const colName of collectionsToBackup) {
    try {
      console.log(`Fetching records from collection: [${colName}]...`);
      const querySnapshot = await getDocs(collection(db, colName));
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      backupData.collections[colName] = records;
      console.log(`  -> Successfully backed up ${records.length} records from ${colName}.`);
    } catch (error) {
      console.error(`[ERROR] Failed to backup collection ${colName}:`, error.message);
    }
  }

  // Save backup file locally in JSON format
  const backupFileName = `datapulse_backup_${Date.now()}.json`;
  fs.writeFileSync(backupFileName, JSON.stringify(backupData, null, 2));

  console.log("\n--------------------------------------------------");
  console.log(`[SUCCESS] Backup file created successfully: ${backupFileName}`);
  console.log("==================================================\n");
}

runAutomatedBackup();
