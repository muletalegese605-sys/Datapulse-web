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

async function deployAiOperatorTrainer() {
  console.log("\n==================================================");
  console.log("DataPulse AI Operator & Marketer Training Mode");
  console.log("==================================================\n");

  const trainingConfig = {
    mode: "Operator & Marketer Transition",
    role: "Fully Automated AI Trainer & Assistant",
    capabilities: [
      "Teaches users how to ingest data step-by-step",
      "Explains all public modules, charts, and reports clearly",
      "Handles general and stakeholder-level operational questions",
      "Excludes sensitive admin-only credentials/backend keys for security"
    ],
    status: "Active & Ready to Train Users",
    configuredAt: new Date().toISOString()
  };

  console.log(`-> Mode: [${trainingConfig.mode}]`);
  console.log(`-> Role: ${trainingConfig.role}`);
  console.log(`-> Operational Status: ${trainingConfig.status}`);
  console.log(`-> System Guidelines: Public and stakeholder sections open for interactive AI tutoring.\n`);

  // Save Training Mode Configuration to Firestore
  console.log("--- Saving AI Trainer Configuration to Firestore ---");
  try {
    const docRef = await addDoc(collection(db, "ai_operator_training_logs"), trainingConfig);
    console.log(`[SAVED] Training Document ID: ${docRef.id}`);
  } catch (error) {
    console.error("[ERROR] Failed to save training log:", error.message);
  }

  console.log("\n==================================================");
  console.log("AI Operator & Marketer Setup Completed Successfully!");
  console.log("==================================================\n");
}

deployAiOperatorTrainer();
