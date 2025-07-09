
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Share2, ExternalLink, Edit3, Trash2, Sparkles, Play } from 'lucide-react';
import { toast } from 'sonner';

interface ContentCardProps {
  id: string;
  title: string;
  url?: string;
  content?: string;
  type: 'youtube' | 'twitter' | 'linkedin' | 'article' | 'text';
  summary?: string;
  notes?: string;
  tags?: string[];
  isPublic?: boolean;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onGenerateSummary: (id: string) => void;
}

export const ContentCard = ({
  id,
  title,
  url,
  content,
  type,
  summary,
  notes,
  tags = [],
  isPublic,
  onUpdate,
  onDelete,
  onGenerateSummary
}: ContentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editNotes, setEditNotes] = useState(notes || '');
  const [editTags, setEditTags] = useState(tags.join(', '));
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSave = () => {
    onUpdate(id, {
      title: editTitle,
      notes: editNotes,
      tags: editTags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    setIsEditing(false);
    toast.success('Content updated successfully');
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      await onGenerateSummary(id);
      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/brain/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  const renderEmbed = () => {
    if (type === 'youtube' && url) {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
      if (videoId) {
        return (
          <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden mb-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    if (type === 'article' && url) {
      return (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
          <ExternalLink className="h-4 w-4 text-blue-600" />
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            Open Article
          </a>
        </div>
      );
    }

    if (content) {
      return (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
          {content.substring(0, 200)}...
        </div>
      );
    }

    return null;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'youtube': return <Play className="h-4 w-4 text-red-500" />;
      case 'twitter': return <div className="w-4 h-4 bg-blue-400 rounded-full" />;
      case 'linkedin': return <div className="w-4 h-4 bg-blue-600 rounded-sm" />;
      case 'article': return <ExternalLink className="h-4 w-4 text-green-500" />;
      default: return <Brain className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 mb-2">
            {getTypeIcon()}
            <Badge variant="secondary" className="text-xs">
              {type.toUpperCase()}
            </Badge>
            {isPublic && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                PUBLIC
              </Badge>
            )}
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold"
          />
        ) : (
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {renderEmbed()}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="space-y-3 mb-4">
            <Input
              placeholder="Tags (comma separated)"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
            <Textarea
              placeholder="Your notes..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {!isEditing && notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}

        {summary && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300">AI Summary</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex space-x-2 w-full">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={loadingSummary}
                className="flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loadingSummary ? 'Generating...' : 'AI Summary'}</span>
              </Button>
              {url && (
                <Button size="sm" variant="ghost" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Open</span>
                  </a>
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
