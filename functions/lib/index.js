"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemItem = exports.awardPoints = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const fail = (c, m) => {
    throw new https_1.HttpsError(c, m);
};
async function profile(uid) {
    const s = await db.doc(`users/${uid}`).get();
    if (!s.exists)
        fail("not-found", "Account profile not found.");
    return s.data();
}
exports.awardPoints = (0, https_1.onCall)(async (r) => {
    const uid = r.auth?.uid;
    if (!uid)
        fail("unauthenticated", "Sign in required.");
    const a = await profile(uid);
    if (a.role !== "merchant" || a.status !== "active")
        fail("permission-denied", "Active merchant account required.");
    const { customerUid, merchantId, purchaseAmount, reference, note } = r.data ?? {};
    if (typeof customerUid !== "string" ||
        typeof merchantId !== "string" ||
        typeof purchaseAmount !== "number" ||
        purchaseAmount <= 0)
        fail("invalid-argument", "Invalid award request.");
    await db.runTransaction(async (t) => {
        const m = (await t.get(db.doc(`merchants/${merchantId}`))).data();
        if (!m || m.ownerUid !== uid || m.status !== "active")
            fail("permission-denied", "Merchant unavailable.");
        const c = await profile(customerUid);
        if (c.role !== "customer" || c.status !== "active")
            fail("failed-precondition", "Customer unavailable.");
        if (reference) {
            const d = await t.get(db
                .collection("pointsTransactions")
                .where("merchantId", "==", merchantId)
                .where("reference", "==", reference)
                .limit(1));
            if (!d.empty)
                fail("already-exists", "Receipt already awarded.");
        }
        const points = Math.floor(purchaseAmount * (m.pointsRule?.pointsPerCurrencyUnit || 1));
        if (points < 1)
            fail("invalid-argument", "Purchase does not earn points.");
        const b = db.doc(`pointsBalances/${merchantId}_${customerUid}`), old = (await t.get(b)).data()?.balance || 0, newBalance = old + points, tx = db.collection("pointsTransactions").doc();
        t.set(b, {
            merchantId,
            customerUid,
            balance: newBalance,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
        t.set(tx, {
            customerUid,
            merchantId,
            type: "award",
            points,
            balanceAfter: newBalance,
            reference: reference || null,
            note: note || null,
            createdByUid: uid,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
    });
    return { ok: true };
});
exports.redeemItem = (0, https_1.onCall)(async (r) => {
    const uid = r.auth?.uid;
    if (!uid)
        fail("unauthenticated", "Sign in required.");
    const c = await profile(uid);
    if (c.role !== "customer" || c.status !== "active")
        fail("permission-denied", "Active customer required.");
    const { listingId, requestId } = r.data ?? {};
    if (typeof listingId !== "string" || typeof requestId !== "string")
        fail("invalid-argument", "Invalid redemption.");
    return db.runTransaction(async (t) => {
        const id = `redemptionRequests/${uid}_${requestId}`, dup = await t.get(db.doc(id));
        if (dup.exists)
            return dup.data();
        const l = (await t.get(db.doc(`listings/${listingId}`))).data();
        if (!l ||
            l.status !== "published" ||
            !Number.isInteger(l.pointsPrice) ||
            l.pointsPrice < 1)
            fail("failed-precondition", "Listing unavailable.");
        const m = (await t.get(db.doc(`merchants/${l.merchantId}`))).data();
        if (!m || m.status !== "active")
            fail("failed-precondition", "Merchant unavailable.");
        if (!l.unlimitedStock &&
            (!Number.isInteger(l.stockQuantity) || l.stockQuantity < 1))
            fail("failed-precondition", "Out of stock.");
        const b = db.doc(`pointsBalances/${l.merchantId}_${uid}`), old = (await t.get(b)).data()?.balance || 0;
        if (old < l.pointsPrice)
            fail("failed-precondition", "Insufficient points.");
        const red = db.collection("redemptions").doc(), code = red.id.slice(0, 8).toUpperCase();
        t.set(b, {
            merchantId: l.merchantId,
            customerUid: uid,
            balance: old - l.pointsPrice,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
        t.set(db.collection("pointsTransactions").doc(), {
            customerUid: uid,
            merchantId: l.merchantId,
            type: "redeem",
            points: -l.pointsPrice,
            balanceAfter: old - l.pointsPrice,
            relatedListingId: listingId,
            relatedRedemptionId: red.id,
            createdByUid: uid,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        t.set(red, {
            customerUid: uid,
            merchantId: l.merchantId,
            listingId,
            pointsSpent: l.pointsPrice,
            status: "pending",
            redemptionCode: code,
            fulfillmentType: l.fulfillmentType,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        if (!l.unlimitedStock)
            t.update(db.doc(`listings/${listingId}`), {
                stockQuantity: l.stockQuantity - 1,
            });
        t.set(db.doc(id), {
            redemptionId: red.id,
            code,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return { redemptionId: red.id, code };
    });
});
