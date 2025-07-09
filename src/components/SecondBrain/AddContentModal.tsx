
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Link, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: any) => void;
}

export const AddContentModal = ({ isOpen, onClose, onAdd }: AddContentModalProps) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const detectContentType = (url: string): 'youtube' | 'twitter' | 'linkedin' | 'article' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('linkedin.com')) return 'linkedin';
    return 'article';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let contentType = 'text';
      let processedTitle = title;

      if (inputType === 'url' && url) {
        contentType = detectContentType(url);
        if (!title) {
          // Try to fetch title from URL metadata
          processedTitle = url.split('/').pop() || 'Untitled Content';
        }
      }

      const newContent = {
        id: Date.now().toString(),
        title: processedTitle,
        url: inputType === 'url' ? url : undefined,
        content: inputType === 'text' ? content : undefined,
        type: contentType,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        created_at: new Date().toISOString(),
        notes: '',
        summary: '',
        isPublic: false
      };

      await onAdd(newContent);
      
      // Reset form
      setUrl('');
      setTitle('');
      setContent('');
      setTags('');
      onClose();
      
      toast.success('Content added successfully!');
    } catch (error) {
      toast.error('Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Content</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={inputType === 'url' ? 'default' : 'outline'}
              onClick={() => setInputType('url')}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              URL
            </Button>
            <Button
              type="button"
              variant={inputType === 'text' ? 'default' : 'outline'}
              onClick={() => setInputType('text')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Text
            </Button>
          </div>

          {inputType === 'url' ? (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Paste your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Give it a meaningful title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="productivity, learning, inspiration"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Content'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
