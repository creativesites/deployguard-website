import * as admin from 'firebase-admin'

admin.initializeApp()

export { validateLicense } from './validateLicense'
export { stripeWebhook } from './stripeWebhook'
export { provisionTenant } from './provisionTenant'
export { trialExpiry } from './trialExpiry'
