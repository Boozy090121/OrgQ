// This script seeds the Firestore database with initial data.

// IMPORTANT: Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your Firebase service account key file before running this.
// Example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

const admin = require('firebase-admin');

// --- Configuration ---
// Replace with your project ID if not using GOOGLE_APPLICATION_CREDENTIALS
// const projectId = "YOUR_PROJECT_ID"; 

// --- Data to Seed ---

const departments = [
  { id: 'Quality', name: 'Quality Assurance', color: '#3b82f6' },
  { id: 'Operations', name: 'Manufacturing Ops', color: '#10b981' },
  { id: 'Engineering', name: 'Process Engineering', color: '#f97316' },
];

const factories = [
  { id: 'f1', name: 'Factory A (Seed)', clients: [], workOrderVolume: 1000, specialRequirements: ['ISO 9001'] },
  { id: 'f2', name: 'Factory B (Seed)', clients: [], workOrderVolume: 2500, specialRequirements: ['AS 9100'] },
];

// Add more seed data here (clients, roles, tasks, etc.) if needed
// const roles = [ ... ];
// const clients = [ ... ]; 

// --- Seeding Logic ---

async function seedFirestore() {
  try {
    console.log('Initializing Firebase Admin SDK...');
    admin.initializeApp({
      // If using GOOGLE_APPLICATION_CREDENTIALS, projectId might be inferred
      // projectId: projectId, 
      // credential: admin.credential.applicationDefault(), // Use if GOOGLE_APPLICATION_CREDENTIALS is set
    });

    const db = admin.firestore();
    console.log('Firestore Admin SDK initialized.');

    // Seed Departments
    console.log('Seeding departments...');
    const deptBatch = db.batch();
    departments.forEach(dept => {
      const docRef = db.collection('departments').doc(dept.id); // Use predefined ID
      deptBatch.set(docRef, { name: dept.name, color: dept.color });
    });
    await deptBatch.commit();
    console.log(`${departments.length} departments seeded.`);

    // Seed Factories
    console.log('Seeding factories...');
    const factoryBatch = db.batch();
    factories.forEach(factory => {
      // For factories, we can use addDoc or set with a specific ID if desired
      // Using addDoc here for simplicity, will generate random IDs
      // const docRef = db.collection('factories').doc(); // Use addDoc equivalent or generate ID
      // factoryBatch.set(docRef, factory);
      
      // OR Set with specific ID from data
      const docRef = db.collection('factories').doc(factory.id);
      // Exclude the ID from the data being set if it's the document key
      const { id, ...factoryData } = factory; 
      factoryBatch.set(docRef, factoryData); 
    });
    await factoryBatch.commit();
    console.log(`${factories.length} factories seeded.`);

    // Add seeding logic for other collections here...
    // console.log('Seeding roles...');
    // ... 

    console.log('\nSeeding completed successfully!');

  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1); // Exit with error code
  }
}

seedFirestore(); 