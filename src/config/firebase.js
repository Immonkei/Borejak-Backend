import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Get from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    
    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('Missing Firebase environment variables');
    }
    
    // Clean the private key (remove quotes, fix newlines)
    const cleanedPrivateKey = privateKey
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');
    
    // Initialize with minimal configuration
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId.trim(),
        privateKey: cleanedPrivateKey,
        clientEmail: clientEmail.trim().replace(/^["']|["']$/g, '')
      })
    });
    
    console.log('✅ Firebase Admin initialized');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    
    // In production, you might want to continue without Firebase
    // In development, throw the error
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

export default admin;