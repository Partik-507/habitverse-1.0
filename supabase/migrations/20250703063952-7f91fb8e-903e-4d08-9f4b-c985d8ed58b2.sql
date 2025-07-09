
-- Create note_folders table for organizing notes
CREATE TABLE public.note_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  parent_id UUID REFERENCES note_folders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.note_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for note_folders
CREATE POLICY "Users can view their own note folders" 
  ON public.note_folders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own note folders" 
  ON public.note_folders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own note folders" 
  ON public.note_folders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note folders" 
  ON public.note_folders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update existing notes table to support additional fields needed for Note Mastery
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS folder_path TEXT DEFAULT '/';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS backlinks TEXT[] DEFAULT '{}';
