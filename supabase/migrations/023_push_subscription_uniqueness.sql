-- One subscription endpoint per user, so the client can refresh keys idempotently.

CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_user_endpoint
  ON public.push_subscriptions (user_id, endpoint);
