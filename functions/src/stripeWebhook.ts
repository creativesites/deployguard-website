import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'

const stripe = new Stripe(functions.config().stripe?.secret_key ?? process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
})

const TIER_BY_PRICE: Record<string, 'starter' | 'professional'> = {}

function guardLimitForTier(tier: string): number {
  return tier === 'starter' ? 50 : tier === 'professional' ? 250 : 0
}

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = functions.config().stripe?.webhook_secret ?? process.env.STRIPE_WEBHOOK_SECRET ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)
  } catch {
    res.status(400).send('Webhook signature invalid')
    return
  }

  const db = admin.firestore()
  const now = admin.firestore.Timestamp.now()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const licenseId = session.metadata?.licenseId
    const subId = session.subscription as string

    if (licenseId && subId) {
      const sub = await stripe.subscriptions.retrieve(subId)
      const priceId = sub.items.data[0]?.price.id ?? ''
      const tier = TIER_BY_PRICE[priceId] ?? 'starter'
      const periodEnd = new Date(sub.current_period_end * 1000)

      await db.collection('licenses').doc(licenseId).update({
        status: 'active',
        tier,
        guardLimit: guardLimitForTier(tier),
        stripeSubscriptionId: subId,
        stripeCustomerId: session.customer as string,
        subscriptionExpiresAt: admin.firestore.Timestamp.fromDate(periodEnd),
        updatedAt: now,
      })
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = invoice.subscription as string
    const snap = await db.collection('licenses').where('stripeSubscriptionId', '==', subId).limit(1).get()
    if (!snap.empty) {
      await snap.docs[0].ref.update({ status: 'suspended', updatedAt: now })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const snap = await db.collection('licenses').where('stripeSubscriptionId', '==', sub.id).limit(1).get()
    if (!snap.empty) {
      await snap.docs[0].ref.update({ status: 'expired', updatedAt: now })
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = invoice.subscription as string
    const snap = await db.collection('licenses').where('stripeSubscriptionId', '==', subId).limit(1).get()
    if (!snap.empty) {
      const sub = await stripe.subscriptions.retrieve(subId)
      const periodEnd = new Date(sub.current_period_end * 1000)
      await snap.docs[0].ref.update({
        status: 'active',
        subscriptionExpiresAt: admin.firestore.Timestamp.fromDate(periodEnd),
        updatedAt: now,
      })
    }
  }

  res.json({ received: true })
})
