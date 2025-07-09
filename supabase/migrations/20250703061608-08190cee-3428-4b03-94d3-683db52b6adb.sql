
-- Create brain_contents table for Second Brain feature
CREATE TABLE public.brain_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'twitter', 'linkedin', 'article', 'text')),
  summary TEXT,
  notes TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.brain_contents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own brain contents" 
  ON public.brain_contents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brain contents" 
  ON public.brain_contents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brain contents" 
  ON public.brain_contents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brain contents" 
  ON public.brain_contents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create public view policy for shared content
CREATE POLICY "Public can view shared brain contents" 
  ON public.brain_contents 
  FOR SELECT 
  USING (is_public = true);
