-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    source VARCHAR(100) DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscriptions(source);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscriptions_updated_at 
    BEFORE UPDATE ON newsletter_subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public to subscribe (insert)
CREATE POLICY "Allow public subscription" ON newsletter_subscriptions
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Allow users to view their own subscription
CREATE POLICY "Allow users to view own subscription" ON newsletter_subscriptions
    FOR SELECT 
    TO public 
    USING (auth.jwt() ->> 'email' = email);

-- Allow users to unsubscribe (update their own record)
CREATE POLICY "Allow users to unsubscribe" ON newsletter_subscriptions
    FOR UPDATE 
    TO public 
    USING (auth.jwt() ->> 'email' = email);

-- Allow admin/authenticated users to manage all subscriptions
CREATE POLICY "Allow admin to manage subscriptions" ON newsletter_subscriptions
    FOR ALL 
    TO authenticated 
    USING (true);