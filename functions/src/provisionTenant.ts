import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { v4 as uuidv4 } from 'uuid'

interface ProvisionRequest {
  uid: string
  email: string
  companyName: string
  guardCount: number
  phone: string
  country: string
  subdomain: string
}

function tierFromGuardCount(count: number): 'starter' | 'professional' | 'enterprise' {
  if (count <= 50) return 'starter'
  if (count <= 250) return 'professional'
  return 'enterprise'
}

function guardLimitFromTier(tier: string): number {
  return tier === 'starter' ? 50 : tier === 'professional' ? 250 : 0
}

export const provisionTenant = functions.https.onCall(
  async (data: ProvisionRequest) => {
    const db = admin.firestore()
    const now = admin.firestore.Timestamp.now()
    const previewExpiry = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    )

    const licenseKey = uuidv4()
    const tier = tierFromGuardCount(data.guardCount)
    const subdomain = data.subdomain || data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24)

    // Create tenant record
    const tenantRef = await db.collection('tenants').add({
      name: data.companyName,
      subdomain,
      ownerId: data.uid,
      odooDbName: `dg_${subdomain}`,
      status: 'provisioning',
      provisionedAt: null,
      phone: data.phone,
      country: data.country,
      createdAt: now,
    })

    // Create user record
    await db.collection('users').doc(data.uid).set({
      email: data.email,
      tenantId: tenantRef.id,
      role: 'owner',
      displayName: data.companyName,
      createdAt: now,
    })

    // Create license record
    await db.collection('licenses').add({
      key: licenseKey,
      type: 'normal',
      tier,
      status: 'preview',
      previewExpiresAt: previewExpiry,
      subscriptionExpiresAt: null,
      guardLimit: guardLimitFromTier(tier),
      tenantId: tenantRef.id,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      createdAt: now,
      updatedAt: now,
    })

    // Send welcome email via Firebase Extensions (SendGrid/SMTP)
    await db.collection('mail').add({
      to: data.email,
      message: {
        subject: 'Welcome to DeployGuard OS — Your License Key',
        html: `
          <h2>Welcome to DeployGuard OS, ${data.companyName}!</h2>
          <p>Your 7-day free trial has started. Here is your license key:</p>
          <p style="font-family: monospace; background: #f0f0f0; padding: 12px; border-radius: 6px; font-size: 16px;">
            ${licenseKey}
          </p>
          <h3>How to activate:</h3>
          <ol>
            <li>Log into your Odoo instance at <a href="https://${subdomain}.deployguard.io">https://${subdomain}.deployguard.io</a></li>
            <li>Go to Settings → General Settings</li>
            <li>Find the DeployGuard License section</li>
            <li>Paste your license key and click Validate Now</li>
          </ol>
          <p>Your instance is being set up and will be ready within a few minutes.</p>
          <p>Questions? Email us at <a href="mailto:support@deployguard.io">support@deployguard.io</a></p>
        `,
      },
    })

    return { success: true, licenseKey, tenantId: tenantRef.id }
  }
)
