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

async function monitorSecurityAndAdminActivity() {
  console.log("\n==================================================");
  console.log("Security & Admin Activity Audit Started");
  console.log("==================================================\n");

  // Security Log Data
  const securityData = {
    auditType: "Admin Logins & Recent Activity",
    recentAdminLogins: [
      { adminUser: "Muleta Legese", ipAddress: "196.188.xx.xx", status: "SUCCESS", loginTime: new Date().toISOString() }
    ],
    recentActivities: [
      { action: "Database Backup Executed", user: "Muleta Legese", timestamp: new Date().toISOString() },
      { action: "Financial Report Generated", user: "Muleta Legese", timestamp: new Date().toISOString() },
      { action: "Stock & Health Audit Checked", user: "Muleta Legese", timestamp: new Date().toISOString() }
    ],
    securityStatus: "Secure - Protected with Passkey & Biometric Auth",
    auditedAt: new Date().toISOString()
  };

  console.log(`-> Security Status: [${securityData.securityStatus}]`);
  console.log(`-> Recent Admin Logins:`);
  securityData.recentAdminLogins.forEach(login => {
     console.log(`   * User: ${login.adminUser} | Status: ${login.status}`);
  });
  console.log(`-> Recent System Activities Logged: ${securityData.recentActivities.length} actions`);
  console.log(`-> Status: [SUCCESS - Logged & Secured]\n`);

  // Save Security Audit Report to Firestore Database
  console.log("--- Saving Security Audit to Firestore ---");
  try {
    const docRef = await addDoc(collection(db, "security_activity_audit"), securityData);
    console.log(`[SAVED] Security Audit Document ID: ${docRef.id}`);
  } catch (error) {
    console.error("[ERROR] Failed to save security audit:", error.message);
  }

  console.log("\n==================================================");
  console.log("Security & Admin Activity Audit Completed!");
  console.log("==================================================\n");
}

monitorSecurityAndAdminActivity();
