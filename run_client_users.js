const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

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

const enterpriseUsers = [
  { email: "manager@datapulse.com", password: "SecurePassword123!", role: "Manager", name: "Operations Manager" },
  { email: "sales@datapulse.com", password: "SecurePassword123!", role: "Sales", name: "Sales Representative" },
  { email: "accounts@datapulse.com", password: "SecurePassword123!", role: "Accounts", name: "Finance Accountant" }
];

async function createEnterpriseUsers() {
  console.log("Hojjettoota Enterprise uumuu eegaleera...");
  for (const userData of enterpriseUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      });

      console.log(`Milkaa'inaan uumame: ${userData.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`E-meeliin kun duranuu ni jira: ${userData.email}`);
      } else {
        console.error(`Rakkoo ${userData.email} irratti mudate:`, error.message);
      }
    }
  }
}

createEnterpriseUsers();
