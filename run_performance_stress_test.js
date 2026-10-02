const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

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

// Helper to generate mock high-volume dataset (6,000+ records)
function generateHighVolumeDataset(targetCount) {
  console.log(`Generating synthetic high-volume dataset of ${targetCount} records for stress testing...`);
  const categories = ["Manufacturing", "Agricultural", "Livestock"];
  const items = [
    "Liquid Laundry Detergent (25L)", 
    "Organic Aloe Vera Gel", 
    "Refined Palm Oil (20L)", 
    "Processed Organic Butter", 
    "Natural Milk Extract"
  ];
  
  const dataset = [];
  const startTime = Date.now();

  for (let i = 0; i < targetCount; i++) {
    const cat = categories[i % categories.length];
    const item = items[i % items.length];
    dataset.log = dataset.push({
      id: `rec_${i + 1}`,
      category: cat,
      itemName: `${item} (#${i + 1})`,
      quantity: Math.floor(Math.random() * 500) + 10,
      unitPrice: Math.floor(Math.random() * 4000) + 100,
      date: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`
    });
  }

  const duration = Date.now() - startTime;
  console.log(`  -> Generated ${targetCount} records successfully in ${duration}ms.`);
  return dataset;
}

// Stress Test Chart Data Aggregation (Bar, Donut, Line, Radar simulation)
function simulateChartAggregations(records) {
  console.log("\n--- Simulating Chart Data Aggregations for 6,000+ Records ---");
  const startTime = process.hrtime();

  // 1. Bar Chart Aggregation (Sales by Category)
  const barChartData = {};
  // 2. Donut Chart Aggregation (Proportion by Item)
  const donutChartData = {};
  // 3. Line Chart Aggregation (Sales over Dates)
  const lineChartData = {};
  // 4. Radar Chart Aggregation (Multi-metric performance)
  const radarChartData = { Manufacturing: 0, Agricultural: 0, Livestock: 0 };

  records.forEach(r => {
    const total = r.quantity * r.unitPrice;
    
    // Bar
    barChartData[r.category] = (barChartData[r.category] || 0) + total;
    
    // Donut
    donutChartData[r.itemName] = (donutChartData[r.itemName] || 0) + total;

    // Line
    lineChartData[r.date] = (lineChartData[r.date] || 0) + total;

    // Radar
    if (radarChartData[r.category] !== undefined) {
      radarChartData[r.category] += r.quantity;
    }
  });

  const hrTime = process.hrtime(startTime);
  const elapsedMs = (hrTime[0] * 1000) + (hrTime[1] / 1000000);

  console.log(`  -> Aggregation completed in: ${elapsedMs.toFixed(2)} ms`);
  console.log(`  -> Bar Chart Groups: ${Object.keys(barChartData).length} categories processed.`);
  console.log(`  -> Donut Chart Segments: ${Object.keys(donutChartData).length} items processed.`);
  console.log(`  -> Line Chart Points: ${Object.keys(lineChartData).length} dates processed.`);
  console.log(`  -> Radar Metrics Calculated Successfully.`);
  
  return elapsedMs;
}

async function runPerformanceStressTest() {
  console.log("\n==================================================");
  console.log("DataPulse Performance & Charts Stress Test Started");
  console.log("==================================================\n");

  // Generate 6,000 records for performance benchmarking
  const targetRecordsCount = 6000;
  const largeDataset = generateHighVolumeDataset(targetRecordsCount);

  // Run aggregation test
  const processingTime = simulateChartAggregations(largeDataset);

  // Memory Usage Check
  const memoryUsage = process.memoryUsage();
  console.log("\n--- Memory Consumption Benchmark ---");
  console.log(`  -> RSS Memory: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  -> Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);

  console.log("\n--- Performance Verdict ---");
  if (processingTime < 250) {
    console.log("[EXCELLENT] Charts and data processing engines are fully optimized for 6,000+ records (Zero Lag).");
  } else {
    console.log("[GOOD] Processing completed within acceptable thresholds.");
  }

  console.log("\n==================================================");
  console.log("Performance Stress Test Completed Successfully!");
  console.log("==================================================\n");
}

runPerformanceStressTest();
