const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Project ID kee
initializeApp({
  projectId: 'datapulseapp-20237'
});

const db = getFirestore();

// Omisha Warshaa, Qonnaa fi Loonii daataa daldala dhugaa
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

async function ingestData() {
  const collectionName = 'users'; // Collection database keetiiti
  console.log("Daataa daldala dhugaa galchuuf qophaa'aa jira...");

  const batch = db.batch();

  realData.forEach((item) => {
    const docRef = db.collection(collectionName).doc(); // Document ID carraa (auto-generate) ta'uun uuma
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log(`Milkaa'inaan daataa daldala dhugaa ${realData.length} galchuun danda'ameera! Gross Sales walii gala ilaali.`);
}

ingestData().catch(console.error);
