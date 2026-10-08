const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, getDoc } = require("firebase/firestore");
const crypto = require('crypto');

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
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Password Hashing Simulation (SHA-256 / Secure Salt Check)
function testPasswordHashing() {
  console.log("\n--- 1. Password Hashing Test ---");
  const password = "SecurePassword123!";
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  console.log("Password hashed successfully using SHA-256 + Salt.");
  console.log(`Hash Sample: ${hash.substring(0, 20)}...`);
}

// 2. Mock JWT Generation & Verification
function testJwtToken() {
  console.log("\n--- 2. JWT Token Generation & Verification Test ---");
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ 
    sub: "manager_uid_123", 
    email: "manager@datapulse.com", 
    role: "Manager",
    iat: Math.floor(Date.now() / 1000)
  })).toString('base64url');
  
  const secret = "datapulse_super_secret_key_2026";
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  
  const token = `${header}.${payload}.${signature}`;
  console.log("JWT Token generated successfully.");
  console.log(`Token: ${token.substring(0, 30)}...`);
  
  // Verify token
  const [h, p, s] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  if (s === expectedSig) {
    console.log("JWT Token signature verified successfully!");
  } else {
    console.log("JWT Token verification failed!");
  }
}

// 3. Login & RBAC Role Validation Test
async function testLoginAndRBAC() {
  console.log("\n--- 3. Authentication & RBAC Test ---");
  const testAccounts = [
    { email: "manager@datapulse.com", password: "SecurePassword123!", expectedRole: "Manager" },
    { email: "sales@datapulse.com", password: "SecurePassword123!", expectedRole: "Sales" },
    { email: "accounts@datapulse.com", password: "SecurePassword123!", expectedRole: "Accounts" }
  ];

  for (const acc of testAccounts) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, acc.email, acc.password);
      const uid = userCred.user.uid;
      
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(`[LOGIN SUCCESS] ${acc.email} | Role in DB: ${userData.role}`);
        
        // RBAC Enforcement Check
        if (userData.role === acc.expectedRole) {
          console.log(`  -> RBAC Check Passed: Access granted for ${userData.role}.`);
        } else {
          console.log(`  -> RBAC Check Failed: Expected ${acc.expectedRole}, got ${userData.role}.`);
        }
      } else {
        console.log(`[WARNING] User data doc not found for ${acc.email}`);
      }
    } catch (error) {
      console.error(`[LOGIN ERROR] Failed for ${acc.email}:`, error.message);
    }
  }
}

async function runSecuritySuite() {
  console.log("DataPulse Enterprise Security Suite Starting...");
  testPasswordHashing();
  testJwtToken();
  await testLoginAndRBAC();
  console.log("\n--- Security Suite Tests Completed! ---");
}

runSecuritySuite();
