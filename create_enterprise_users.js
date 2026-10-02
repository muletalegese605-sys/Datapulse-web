const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  projectId: 'datapulseapp-20237'
});

const auth = getAuth();
const db = getFirestore();

// Hojjettoota Enterprise fi Aangoo isaanii (Roles)
const enterpriseUsers = [
  { email: "manager@datapulse.com", password: "SecurePassword123!", role: "Manager", name: "Operations Manager" },
  { email: "sales@datapulse.com", password: "SecurePassword123!", role: "Sales", name: "Sales Representative" },
  { email: "accounts@datapulse.com", password: "SecurePassword123!", role: "Accounts", name: "Finance Accountant" }
];

async function createUsersAndRoles() {
  console.log("Hojjettoota Enterprise uumuu eegaleera...");

  for (const userData of enterpriseUsers) {
    try {
      // 1. Firebase Auth keessatti User uumuu
      let userRecord;
      try {
        userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
        });
        console.log(`User uumameera: ${userData.email} (UID: ${userRecord.uid})`);
      } catch (err) {
        if (err.code === 'auth/email-already-exists') {
          userRecord = await auth.getUserByEmail(userData.email);
          console.log(`User duranuu jira: ${userData.email}`);
        } else {
          throw err;
        }
      }

      // 2. Custom Claims (Role) kennuu
      await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });
      console.log(`Role '${userData.role}' kennameeraaf: ${userData.email}`);

      // 3. Firestore keessatti ragaa hojjetichaa galchuu
      await db.collection('users').doc(userRecord.uid).set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error(`Rakkoo ${userData.email} irratti mudate:`, error.message);
    }
  }

  console.log("Hojjettoonni Enterprise cufa milkaa'inaan qindaa'aniiru!");
}

createUsersAndRoles().catch(console.error);
