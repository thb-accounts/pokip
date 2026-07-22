-- Add stock tracking and purchases table
CREATE TABLE IF NOT EXISTS public.item_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL UNIQUE,
  total_stock INTEGER NOT NULL DEFAULT 4,
  remaining_stock INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track individual user purchases
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  purchase_code TEXT NOT NULL,
  tokens_spent INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id) -- Prevent duplicate purchases per user per item
);

-- Enable RLS
ALTER TABLE public.item_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for item_stock (readable by everyone, no write access for users)
CREATE POLICY "Anyone can view item stock" 
ON public.item_stock 
FOR SELECT 
USING (true);

-- RLS policies for user_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.user_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
ON public.user_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_item_stock_updated_at
BEFORE UPDATE ON public.item_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Initialize stock for existing items
INSERT INTO public.item_stock (item_id, total_stock, remaining_stock) VALUES
('gaming-chair', 4, 4),
('gaming-headset', 4, 4),
('gaming-keyboard', 4, 4),
('gaming-mouse', 4, 4),
('robux-currency', 4, 4),
('bell-cafe-cookie', 4, 4)
ON CONFLICT (item_id) DO NOTHING;

-- Update profiles table to set new users to 0 tokens
ALTER TABLE public.profiles ALTER COLUMN tokens SET DEFAULT 0;

-- Update handle_new_user function to give 0 tokens
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, tokens)
  VALUES (NEW.id, NEW.email, 0);
  RETURN NEW;
END;
$function$;