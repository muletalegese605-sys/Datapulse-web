const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Project ID kee kallattiidhaan asitti dabali
initializeApp({
  projectId: 'datapulseapp-20237'
});

const db = getFirestore();

async function clearAndUpload() {
  const collectionName = 'users'; // Collection kee asitti jijjiiri yoo jijjiirame
  
  console.log("Daataa haquuf qophaa'aa jira...");
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log("Data tokkoyyuu hin jiru.");
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Daataa demo duraanii hunda (${snapshot.size} records) haquun milkaa'era!`);
}

clearAndUpload().catch(console.error);
