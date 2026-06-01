import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const trialExpiry = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const db = admin.firestore()
    const now = admin.firestore.Timestamp.now()
    const twoDaysFromNow = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    )

    const previewLicenses = await db
      .collection('licenses')
      .where('status', '==', 'preview')
      .get()

    const batch = db.batch()
    const warningEmails: Array<{ tenantId: string; daysLeft: number }> = []

    for (const doc of previewLicenses.docs) {
      const lic = doc.data()
      const expiry = lic.previewExpiresAt as admin.firestore.Timestamp

      if (!expiry) continue

      if (expiry.toMillis() <= now.toMillis()) {
        batch.update(doc.ref, { status: 'expired', updatedAt: now })
      } else if (expiry.toMillis() <= twoDaysFromNow.toMillis()) {
        const daysLeft = Math.ceil((expiry.toMillis() - now.toMillis()) / 86_400_000)
        warningEmails.push({ tenantId: lic.tenantId, daysLeft })
      }
    }

    await batch.commit()

    // Send warning emails for expiring trials
    for (const { tenantId, daysLeft } of warningEmails) {
      const userSnap = await db
        .collection('users')
        .where('tenantId', '==', tenantId)
        .where('role', '==', 'owner')
        .limit(1)
        .get()

      if (userSnap.empty) continue

      const user = userSnap.docs[0].data()
      await db.collection('mail').add({
        to: user.email,
        message: {
          subject: `Your DeployGuard OS trial expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
          html: `
            <h2>Your trial is ending soon</h2>
            <p>Your DeployGuard OS trial expires in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>.</p>
            <p>Upgrade to a paid plan to keep your data and continue using the platform.</p>
            <a href="https://deployguard.io/dashboard/billing"
               style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
              Upgrade Now
            </a>
            <p style="margin-top: 16px; color: #666; font-size: 14px;">
              Starting at $99/mo for up to 50 guards.
            </p>
          `,
        },
      })
    }

    functions.logger.info(`Trial expiry check: ${previewLicenses.size} preview licenses checked`)
  })
