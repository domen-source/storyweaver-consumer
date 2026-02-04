# Payments – Go-live checklist (Stripe + Supabase)

## Before switching to live payments
- [ ] Orders table exists in Supabase
- [ ] `/api/create-checkout-session` creates order first
- [ ] Order ID passed to Stripe metadata
- [ ] Stripe webhook implemented (`checkout.session.completed`)
- [ ] Webhook marks order as paid in Supabase
- [ ] Pricing calculated server-side (not trusted from client)
- [ ] Shipping address saved from Stripe session
- [ ] Test payment completed end-to-end
- [ ] Live keys added to production env
- [ ] Production webhook URL added in Stripe Dashboard

