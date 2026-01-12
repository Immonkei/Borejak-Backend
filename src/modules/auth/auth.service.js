import admin from '../../config/firebase.js';
import { supabase } from '../../config/supabase.js';

// 🔐 Verify Firebase ID Token
export async function verifyFirebaseToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}

// 👤 Find or create user in Supabase
export async function findOrCreateUser(firebaseUser, extraData = {}) {
  const {
    uid,
    email,
    firebase: { sign_in_provider }
  } = firebaseUser;

  const providerMap = {
    phone: 'phone',
    password: 'email',
    'google.com': 'google',
    'facebook.com': 'facebook'
  };

  const authProvider = providerMap[sign_in_provider] || 'email';

  // 🔒 SAFE UPSERT DATA (AUTH ONLY)
  const upsertData = {
    firebase_uid: uid,
    email: email || null,
    auth_provider: authProvider,
    is_verified: true
  };

  // ✅ ONLY set phone number if explicitly provided (REGISTER / PROFILE)
  if (extraData.phone_number) {
    upsertData.phone_number = extraData.phone_number;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(upsertData, { onConflict: 'firebase_uid' })
    .select()
    .single();

  if (error) throw error;

  return data;
}
