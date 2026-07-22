-- Fix OTP expiry settings by reducing to recommended duration
UPDATE auth.config 
SET otp_exp = 3600 
WHERE true;

-- Note: Password leak protection can only be enabled through the Supabase dashboard
-- under Authentication > Settings > Password Protection