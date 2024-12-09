import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export interface BuddyConfig {
  email: string;
  nickname: string;
  penaltyAmount: number;
  paymentMethod: string;
  paymentDetails: string;
  addedAt: string;
}

export const migrateUserSchema = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const usersSnapshot = await db.collection('users').get();

  const batch = db.batch();

  usersSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.moderators && !data.buddyConfigs) {
      // Create default buddy configs for existing moderators
      const buddyConfigs: { [key: string]: BuddyConfig } = {};
      data.moderators.forEach((email: string) => {
        buddyConfigs[email] = {
          email,
          nickname: '',
          penaltyAmount: 1, // default amount
          paymentMethod: 'paypal', // default method
          paymentDetails: '', // empty by default
          addedAt: new Date().toISOString()
        };
      });

      batch.update(doc.ref, { buddyConfigs });
    }
  });

  await batch.commit();
  res.json({ success: true });
}); 