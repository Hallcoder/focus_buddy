import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export async function checkRateLimit(
  userId: string,
  functionName: string,
  config: RateLimitConfig
): Promise<void> {
  const db = getFirestore();
  const docId = `${userId}_${functionName}`;
  const ref = db.collection("rateLimits").doc(docId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const now = Date.now();

    if (!doc.exists) {
      transaction.set(ref, {
        count: 1,
        windowStart: now,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return;
    }

    const data = doc.data()!;
    const windowStart = data.windowStart as number;
    const count = data.count as number;

    if (now - windowStart > config.windowMs) {
      // Window expired, reset
      transaction.update(ref, {
        count: 1,
        windowStart: now,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return;
    }

    if (count >= config.maxRequests) {
      throw new HttpsError(
        "resource-exhausted",
        `Rate limit exceeded for ${functionName}. Try again later.`
      );
    }

    transaction.update(ref, {
      count: count + 1,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
