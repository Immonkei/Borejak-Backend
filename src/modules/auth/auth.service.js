import admin from '../../config/firebase.js';
import { supabase } from '../../config/supabase.js';

// 🔐 Verify Firebase ID Token
export async function verifyFirebaseToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}

// 👤 Find or create user in Supabase
export async function findOrCreateUser(firebaseUser) {
  const {
    uid,
    phone_number,
    email,
    firebase: { sign_in_provider }
  } = firebaseUser;

  // ✅ Correct provider mapping
  const providerMap = {
    phone: 'phone',
    password: 'email',
    'google.com': 'google',
    'facebook.com': 'facebook'
  };

  const authProvider = providerMap[sign_in_provider] || 'email';

  // ✅ UPSERT (safe & atomic)
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        firebase_uid: uid,
        phone_number: phone_number || null,
        email: email || null,
        auth_provider: authProvider,
        is_verified: true
      },
      { onConflict: 'firebase_uid' }
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}
