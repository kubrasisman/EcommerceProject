/*
  # Create User Sessions and Refresh Tokens Table

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `customer_id` (bigint, not null) - Reference to customer in microservice database
      - `refresh_token_hash` (text, not null) - Hashed refresh token for security
      - `access_token_hash` (text) - Optional hashed access token
      - `ip_address` (inet) - IP address of the session
      - `user_agent` (text) - Browser/device information
      - `is_active` (boolean, default true) - Session status
      - `expires_at` (timestamptz, not null) - Token expiration time
      - `last_activity_at` (timestamptz, default now()) - Last activity timestamp
      - `created_at` (timestamptz, default now()) - Session creation time
      - `updated_at` (timestamptz, default now()) - Last update time

  2. Security
    - Enable RLS on `user_sessions` table
    - Add policy for users to read their own sessions
    - Add policy for users to update their own sessions
    - Add policy for users to delete their own sessions

  3. Indexes
    - Index on customer_id for fast lookups
    - Index on refresh_token_hash for token validation
    - Index on expires_at for cleanup operations

  4. Notes
    - This table provides a backup/audit trail for sessions
    - Primary session storage is in Redis for performance
    - Tokens are hashed for security (never store plain tokens)
    - Sessions can be revoked by setting is_active to false
*/

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id bigint NOT NULL,
  refresh_token_hash text NOT NULL,
  access_token_hash text,
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  expires_at timestamptz NOT NULL,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_customer_id ON user_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token_hash ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (customer_id = (current_setting('request.jwt.claims', true)::json->>'customerId')::bigint);

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (current_setting('request.jwt.claims', true)::json->>'customerId')::bigint);

CREATE POLICY "Users can update their own sessions"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (customer_id = (current_setting('request.jwt.claims', true)::json->>'customerId')::bigint)
  WITH CHECK (customer_id = (current_setting('request.jwt.claims', true)::json->>'customerId')::bigint);

CREATE POLICY "Users can delete their own sessions"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (customer_id = (current_setting('request.jwt.claims', true)::json->>'customerId')::bigint);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
