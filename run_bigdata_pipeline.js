const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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

// Mock Large CSV / Raw Dataset containing duplicates and null values
const rawCsvDataset = [
  { itemName: "Liquid Laundry Detergent (25L)", category: "Manufacturing", quantity: 150, unitPrice: 1800, date: "2026-10-01" },
  { itemName: "Liquid Laundry Detergent (25L)", category: "Manufacturing", quantity: 150, unitPrice: 1800, date: "2026-10-01" }, // Duplicate
  { itemName: "Organic Aloe Vera Gel", category: "Agricultural", quantity: null, unitPrice: 3500, date: "2026-10-01" },       // Null quantity
  { itemName: "Refined Palm Oil (20L)", category: "Agricultural", quantity: 210, unitPrice: null, date: "2026-10-01" },           // Null price
  { itemName: "Processed Organic Butter", category: "Livestock", quantity: 180, unitPrice: 650, date: "2026-10-01" },
  { itemName: "Natural Milk Extract", category: "Livestock", quantity: 350, unitPrice: 600, date: "2026-10-01" },
  { itemName: "Processed Organic Butter", category: "Livestock", quantity: 180, unitPrice: 650, date: "2026-10-01" }              // Duplicate
];

async function runBigDataPipeline() {
  console.log("\n==================================================");
  console.log("DataPulse Big Data Pipeline & Auto-Cleaning Started");
  console.log(`Raw Dataset Records Count: ${rawCsvDataset.length}`);
  console.log("==================================================\n");

  // Step 1: Null Imputation (Fill missing values with defaults)
  console.log("--- Step 1: Null Imputation & Validation ---");
  const imputedData = rawCsvDataset.map((row, index) => {
    const cleaned = { ...row };
    if (cleaned.quantity === null || cleaned.quantity === undefined) {
      cleaned.quantity = 1; // Default fallback for missing quantity
      console.log(`  -> Row ${index + 1}: Fixed missing 'quantity' to default (1)`);
    }
    if (cleaned.unitPrice === null || cleaned.unitPrice === undefined) {
      cleaned.unitPrice = 100; // Default fallback for missing price
      console.log(`  -> Row ${index + 1}: Fixed missing 'unitPrice' to default (100)`);
    }
    cleaned.totalSales = cleaned.quantity * cleaned.unitPrice;
    return cleaned;
  });

  // Step 2: Deduplication (Remove exact duplicate items based on itemName and date)
  console.log("\n--- Step 2: Deduplication ---");
  const uniqueMap = new Map();
  imputedData.forEach((row) => {
    const uniqueKey = `${row.itemName}_${row.date}_${row.quantity}_${row.unitPrice}`;
    if (!uniqueMap.has(uniqueKey)) {
      uniqueMap.set(uniqueKey, row);
    }
  });
  const cleanedDataset = Array.from(uniqueMap.values());
  console.log(`  -> Removedduplicates. Records before: ${rawCsvDataset.length}, After: ${cleanedDataset.length}`);

  // Step 3: Ingest Cleaned Data into Firestore
  console.log("\n--- Step 3: Firestore Bulk Ingestion ---");
  for (const item of cleanedDataset) {
    try {
      const docRef = await addDoc(collection(db, "cleaned_business_records"), item);
      console.log(`[INGESTED] ID: ${docRef.id} -> ${item.itemName} (Qty: ${item.quantity}, Total: ${item.totalSales})`);
    } catch (error) {
      console.error(`[ERROR] Failed to ingest ${item.itemName}:`, error.message);
    }
  }

  console.log("\n==================================================");
  console.log("Big Data Pipeline Completed Successfully!");
  console.log("==================================================\n");
}

runBigDataPipeline();
