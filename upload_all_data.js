const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const allRecords = [
  // Omisha Warshaa
  { category: "Manufacturing", cost: 800, id: "SKU-022", name: "Portland Cement", price: 1200, stock: 1000, unit: "Bags" },
  { category: "Manufacturing", cost: 1200, id: "SKU-023", name: "Steel Rebar 12mm", price: 1800, stock: 500, unit: "Pieces" },
  { category: "Manufacturing", cost: 450, id: "SKU-024", name: "Plastic Water Pipe", price: 700, stock: 800, unit: "Meters" },
  { category: "Manufacturing", cost: 2500, id: "SKU-025", name: "Iron Sheet", price: 3500, stock: 200, unit: "Pieces" },
  { category: "Manufacturing", cost: 1500, id: "SKU-026", name: "Wall Paint", price: 2200, stock: 150, unit: "Gallons" },
  { category: "Manufacturing", cost: 150, id: "SKU-027", name: "Nails", price: 250, stock: 300, unit: "Kg" },
  
  // Omisha Qonnaa
  { category: "Agriculture", cost: 8000, id: "SKU-028", name: "Teff (Magna)", price: 12000, stock: 300, unit: "Quintals" },
  { category: "Agriculture", cost: 18000, id: "SKU-029", name: "Coffee (Yirgacheffe)", price: 25000, stock: 100, unit: "Kg" },
  { category: "Agriculture", cost: 9000, id: "SKU-030", name: "Sesame Seed", price: 13000, stock: 150, unit: "Quintals" },
  { category: "Agriculture", cost: 6500, id: "SKU-031", name: "Haricot Beans", price: 9000, stock: 250, unit: "Bags" },
  { category: "Agriculture", cost: 2500, id: "SKU-032", name: "Red Onion", price: 4000, stock: 400, unit: "Kg" },
  { category: "Agriculture", cost: 1500, id: "SKU-033", name: "Potato", price: 2500, stock: 600, unit: "Kg" },
  
  // Omisha Looni
  { category: "Livestock", cost: 40, id: "SKU-034", name: "Fresh Milk", price: 60, stock: 1000, unit: "Liters" },
  { category: "Livestock", cost: 450, id: "SKU-035", name: "Beef Meat", price: 650, stock: 500, unit: "Kg" },
  { category: "Livestock", cost: 12, id: "SKU-036", name: "Eggs", price: 18, stock: 5000, unit: "Pieces" },
  { category: "Livestock", cost: 200, id: "SKU-037", name: "Cheese (Ayib)", price: 350, stock: 200, unit: "Kg" },
  { category: "Livestock", cost: 800, id: "SKU-038", name: "Honey (Pure)", price: 1200, stock: 150, unit: "Kg" },
  { category: "Livestock", cost: 1200, id: "SKU-039", name: "Leather (Sheep)", price: 1800, stock: 100, unit: "Pieces" },
  
  // Daldala
  { category: "Trade", cost: 35000, id: "SKU-040", name: "Laptop (Core i5)", price: 45000, stock: 20, unit: "Pieces" },
  { category: "Trade", cost: 15000, id: "SKU-041", name: "Smartphone", price: 22000, stock: 50, unit: "Pieces" },
  { category: "Trade", cost: 8000, id: "SKU-042", name: "Office Desk", price: 12000, stock: 30, unit: "Pieces" },
  { category: "Trade", cost: 400, id: "SKU-043", name: "Printing Paper (A4)", price: 600, stock: 200, unit: "Reams" },
  { category: "Trade", cost: 250, id: "SKU-044", name: "Detergent Powder", price: 400, stock: 500, unit: "Kg" },
  { category: "Trade", cost: 3500, id: "SKU-045", name: "Sugar (Imported)", price: 4500, stock: 400, unit: "Quintals" }
];

async function uploadNewData() {
  const docRef = db.collection('datasets').doc('ORG-64ECEUVK');
  
  // Count fi Gross Sales ofumaan herreguu
  const count = allRecords.length;
  const grossSales = allRecords.reduce((sum, item) => sum + (item.price * item.stock), 0);

  const newData = {
    count: count,
    grossSales: grossSales,
    records: allRecords
  };

  try {
    await docRef.set(newData);
    console.log(`✅ Daataan haaraan sirriitti galameera! Count: ${count}, Gross Sales: ETB ${grossSales}`);
  } catch (error) {
    console.error('❌ Rakkoo uumame:', error);
  }
}

uploadNewData();
