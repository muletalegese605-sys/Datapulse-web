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

const realData = [
  {
    category: "Omisha Warshaa (Manufacturing)",
    itemName: "Liquid Laundry Detergent (25L)",
    quantity: 150,
    unitPrice: 1800,
    totalSales: 270000,
    date: "2026-10-01",
    status: "Completed"
  },
  {
    category: "Omisha Warshaa (Manufacturing)",
    itemName: "Dishwashing Liquid Soap (5L)",
    quantity: 320,
    unitPrice: 450,
    totalSales: 144000,
    date: "2026-10-01",
    status: "Completed"
  },
  {
    category: "Omisha Qonnaa (Agricultural)",
    itemName: "Organic Aloe Vera Gel (Bulk 50kg)",
    quantity: 40,
    unitPrice: 3500,
    totalSales: 140000,
    date: "2026-10-01",
    status: "Completed"
  },
  {
    category: "Omisha Qonnaa (Agricultural)",
    itemName: "Refined Palm Oil (20L Jerrycan)",
    quantity: 210,
    unitPrice: 2400,
    totalSales: 504000,
    date: "2026-10-01",
    status: "Completed"
  },
  {
    category: "Omisha Loonii (Livestock/Dairy)",
    itemName: "Processed Organic Butter (Kilo)",
    quantity: 180,
    unitPrice: 650,
    totalSales: 117000,
    date: "2026-10-01",
    status: "Completed"
  },
  {
    category: "Omisha Loonii (Livestock/Dairy)",
    itemName: "Natural Milk Fat Extract (Liters)",
    quantity: 350,
    unitPrice: 600,
    totalSales: 210000,
    date: "2026-10-01",
    status: "Completed"
  }
];

async function ingestRealData() {
  console.log("Daataa daldala dhugaa galchuuf eegaleera...");
  
  for (const item of realData) {
    try {
      const docRef = await addDoc(collection(db, "business_records"), item);
      console.log(`Galmeen galeera (ID: ${docRef.id}) -> ${item.itemName}`);
    } catch (error) {
      console.error(`Rakkoo galchuu irratti mudate:`, error.message);
    }
  }

  console.log("Daataan daldala dhugaa cufa milkaa'inaan galfameera!");
}

ingestRealData();
