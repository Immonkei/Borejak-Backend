import admin from '../../config/firebase.js';
import { supabase } from '../../config/supabase.js';

// 🔐 Verify Firebase ID Token
export async function verifyFirebaseToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}

// 👤 Find or create user in Supabase
export async function findOrCreateUser(firebaseUser, extraData = {}) {
  const uid = firebaseUser.uid;
  const email = firebaseUser.email || null;

  const signInProvider =
    firebaseUser.firebase?.sign_in_provider || "password";

  const providerMap = {
    phone: "phone",
    password: "email",
    "google.com": "google",
    "facebook.com": "facebook",
  };

  const authProvider = providerMap[signInProvider] || "email";

  const upsertData = {
    firebase_uid: uid,
    email,
    auth_provider: authProvider,
    is_verified: true,
  };

  // 🔒 Only write phone if explicitly provided
  if (extraData.phone_number) {
    upsertData.phone_number = extraData.phone_number;
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(upsertData, { onConflict: "firebase_uid" })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert error:", error);
    throw error;
  }

  return data;
}

