import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const FEATURE_FLAGS: Record<string, string[]> = {
  starter:      ['basic_roster'],
  professional: ['basic_roster', 'fleet_module', 'advanced_reporting', 'shift_planner_ai'],
  enterprise:   ['basic_roster', 'fleet_module', 'advanced_reporting', 'shift_planner_ai', 'api_access'],
}

interface ValidateRequest {
  licenseKey: string
  installationId?: string
}

export const validateLicense = functions.https.onCall(
  async (data: ValidateRequest) => {
    const { licenseKey } = data

    if (!licenseKey) {
      throw new functions.https.HttpsError('invalid-argument', 'licenseKey is required')
    }

    const db = admin.firestore()
    const snap = await db
      .collection('licenses')
      .where('key', '==', licenseKey)
      .limit(1)
      .get()

    if (snap.empty) {
      return { valid: false, reason: 'License key not found' }
    }

    const doc = snap.docs[0]
    const lic = doc.data()

    const now = admin.firestore.Timestamp.now()

    // Auto-expire preview licenses
    if (lic.status === 'preview' && lic.previewExpiresAt && lic.previewExpiresAt.toMillis() < now.toMillis()) {
      await doc.ref.update({ status: 'expired', updatedAt: now })
      lic.status = 'expired'
    }

    const featureFlags: string[] =
      lic.type === 'dogforce_special'
        ? Object.values(FEATURE_FLAGS).flat()
        : (lic.status === 'preview'
            ? FEATURE_FLAGS['professional'] // full access during trial
            : FEATURE_FLAGS[lic.tier ?? 'starter'] ?? [])

    const expiresAt: string | null =
      lic.type === 'dogforce_special' ? null
        : lic.status === 'preview' ? (lic.previewExpiresAt?.toDate().toISOString() ?? null)
          : (lic.subscriptionExpiresAt?.toDate().toISOString() ?? null)

    return {
      valid: lic.status === 'active' || lic.status === 'preview',
      type: lic.type,
      tier: lic.tier ?? null,
      status: lic.status,
      guardLimit: lic.guardLimit ?? 50,
      featureFlags,
      expiresAt,
    }
  }
)
