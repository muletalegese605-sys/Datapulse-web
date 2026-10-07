const https = require('https');

const BACKEND_URL = "https://datapulse-web-rzon.onrender.com";

// Helper function to make HTTP requests
function checkEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BACKEND_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          body: body.substring(0, 150)
        });
      });
    });

    req.on('error', (err) => {
      resolve({ path, status: 0, ok: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ path, status: 408, ok: false, error: 'Request Timeout' });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runProductionTests() {
  console.log(`\n========================================`);
  console.log(`DataPulse Production Backend Tests`);
  console.log(`Target: ${BACKEND_URL}`);
  console.log(`========================================\n`);

  // 1. Health Check Endpoint
  console.log("1. Testing Server Health & Connectivity...");
  const healthRes = await checkEndpoint('/health');
  if (healthRes.status > 0) {
    console.log(`   -> Endpoint /health responded with status: ${healthRes.status}`);
    console.log(`   -> Response: ${healthRes.body || 'Empty/OK'}`);
  } else {
    console.log(`   -> /health check failed: ${healthRes.error}`);
  }

  // 2. API Status / Root Endpoint
  console.log("\n2. Testing Base API Endpoint...");
  const rootRes = await checkEndpoint('/');
  console.log(`   -> Root endpoint status: ${rootRes.status}`);
  if (rootRes.body) {
    console.log(`   -> Response preview: ${rootRes.body}`);
  }

  // 3. Database Records Endpoint Simulation
  console.log("\n3. Testing Business Records Production Sync...");
  const recordsRes = await checkEndpoint('/api/business-records');
  console.log(`   -> Records endpoint status: ${recordsRes.status}`);
  if (recordsRes.ok || recordsRes.status === 401 || recordsRes.status === 403) {
    console.log("   -> Backend routing and production server are active and responding!");
  } else {
    console.log(`   -> Note: Endpoint returned status ${recordsRes.status} (Check authentication/routes if needed).`);
  }

  console.log("\n========================================");
  console.log("Production Optimization & Test Completed!");
  console.log("========================================\n");
}

runProductionTests();
