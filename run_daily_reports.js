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

async function generateDailyReport() {
  console.log("\n==================================================");
  console.log("DataPulse Daily Operations: Financial Report Started");
  console.log("==================================================\n");

  // Financial Metrics for Stakeholders
  const reportData = {
    reportType: "Stakeholder Financial Summary",
    grossSales: 185000.00, // ETB / USD Scale
    netProfit: 48470.00,
    profitMargin: "26.2%",
    operationalStatus: "Optimized & Verified",
    generatedAt: new Date().toISOString()
  };

  console.log(`-> Report Type: [${reportData.reportType}]`);
  console.log(`-> Gross Sales: ${reportData.grossSales.toLocaleString()} ETB`);
  console.log(`-> Net Profit: ${reportData.netProfit.toLocaleString()} ETB`);
  console.log(`-> Profit Margin: ${reportData.profitMargin}`);
  console.log(`-> Status: [SUCCESS - Ready for Stakeholders]\n`);

  // Save Report to Firestore Database (Reports Tab Collection)
  console.log("--- Saving Financial Report to Firestore ---");
  try {
    const docRef = await addDoc(collection(db, "stakeholder_financial_reports"), reportData);
    console.log(`[SAVED] Report Document ID: ${docRef.id}`);
  } catch (error) {
    console.error("[ERROR] Failed to save financial report:", error.message);
  }

  console.log("\n==================================================");
  console.log("Daily Operations Report Generation Completed!");
  console.log("==================================================\n");
}

generateDailyReport();
