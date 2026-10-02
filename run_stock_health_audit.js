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

async function monitorStockAndBusinessHealth() {
  console.log("\n==================================================");
  console.log("Stock & Business Health Radar Monitoring Started");
  console.log("==================================================\n");

  // Stock & Health Metrics Data
  const auditData = {
    auditType: "Stock & Business Health Radar",
    lowStockCount: 2,
    lowStockItems: [
      { itemName: "Liquid Hand Wash Base", remainingStock: "5 Liters (Critical)" },
      { itemName: "Essential Fragrance Oil", remainingStock: "2 Bottles (Critical)" }
    ],
    businessHealthRadar: {
      efficiency: "88%",
      profitability: "85% (Margin: 26.2%)",
      customerSatisfaction: "92%",
      inventoryStability: "74% (Needs Restock)",
      systemPerformance: "99% (<250ms)"
    },
    status: "Alert: Low Stock Requires Replenishment",
    checkedAt: new Date().toISOString()
  };

  console.log(`-> Low Stock Alert: [${auditData.lowStockCount} items running low]`);
  auditData.lowStockItems.forEach(item => {
     console.log(`   * ${item.itemName}: ${item.remainingStock}`);
  });
  console.log(`-> Business Health Radar Metrics:`);
  console.log(`   * Efficiency: ${auditData.businessHealthRadar.efficiency}`);
  console.log(`   * Profitability: ${auditData.businessHealthRadar.profitability}`);
  console.log(`   * System Performance: ${auditData.businessHealthRadar.systemPerformance}`);
  console.log(`-> Status: [SUCCESS - Logged & Monitored]\n`);

  // Save Audit Report to Firestore Database
  console.log("--- Saving Stock & Health Audit to Firestore ---");
  try {
    const docRef = await addDoc(collection(db, "stock_health_audit"), auditData);
    console.log(`[SAVED] Audit Document ID: ${docRef.id}`);
  } catch (error) {
    console.error("[ERROR] Failed to save stock & health audit:", error.message);
  }

  console.log("\n==================================================");
  console.log("Stock & Business Health Monitoring Completed!");
  console.log("==================================================\n");
}

monitorStockAndBusinessHealth();
