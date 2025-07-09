
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentCard } from '@/components/SecondBrain/ContentCard';
import { AddContentModal } from '@/components/SecondBrain/AddContentModal';
import { Brain, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  url?: string;
  content?: string;
  type: 'youtube' | 'twitter' | 'linkedin' | 'article' | 'text';
  summary?: string;
  notes?: string;
  tags?: string[];
  isPublic?: boolean;
  created_at: string;
}

export default function SecondBrain() {
  const { user } = useAuth();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (user) {
      fetchContents();
    }
  }, [user]);

  const fetchContents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brain_contents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to ensure proper typing
      const typedData: ContentItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url || undefined,
        content: item.content || undefined,
        type: item.type as 'youtube' | 'twitter' | 'linkedin' | 'article' | 'text',
        summary: item.summary || undefined,
        notes: item.notes || undefined,
        tags: item.tags || [],
        isPublic: item.is_public || false,
        created_at: item.created_at
      }));
      
      setContents(typedData);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (newContent: Omit<ContentItem, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brain_contents')
        .insert({
          title: newContent.title,
          url: newContent.url || null,
          content: newContent.content || null,
          type: newContent.type,
          summary: newContent.summary || null,
          notes: newContent.notes || null,
          tags: newContent.tags || [],
          is_public: newContent.isPublic || false,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const typedData: ContentItem = {
        id: data.id,
        title: data.title,
        url: data.url || undefined,
        content: data.content || undefined,
        type: data.type as 'youtube' | 'twitter' | 'linkedin' | 'article' | 'text',
        summary: data.summary || undefined,
        notes: data.notes || undefined,
        tags: data.tags || [],
        isPublic: data.is_public || false,
        created_at: data.created_at
      };

      setContents(prev => [typedData, ...prev]);
    } catch (error) {
      console.error('Error adding content:', error);
      throw error;
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<ContentItem>) => {
    if (!user) return;

    try {
      // Convert updates to database format
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.url !== undefined) dbUpdates.url = updates.url;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;

      const { error } = await supabase
        .from('brain_contents')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setContents(prev => prev.map(content => 
        content.id === id ? { ...content, ...updates } : content
      ));
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('brain_contents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContents(prev => prev.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleGenerateSummary = async (id: string) => {
    const content = contents.find(c => c.id === id);
    if (!content) return;

    try {
      // This would call an AI service to generate summary
      // For now, we'll create a mock summary
      const mockSummary = `This is an AI-generated summary of "${content.title}". Key insights include important points extracted from the content.`;
      
      await handleUpdateContent(id, { summary: mockSummary });
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || content.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Second Brain</h1>
            <p className="text-gray-600 dark:text-gray-400">Your personal knowledge repository</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery || filterType !== 'all' ? 'No matching content found' : 'Your Second Brain is empty'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start building your knowledge repository by adding your first piece of content'
            }
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Content
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <ContentCard
              key={content.id}
              id={content.id}
              title={content.title}
              url={content.url}
              content={content.content}
              type={content.type}
              summary={content.summary}
              notes={content.notes}
              tags={content.tags}
              isPublic={content.isPublic}
              onUpdate={handleUpdateContent}
              onDelete={handleDeleteContent}
              onGenerateSummary={handleGenerateSummary}
            />
          ))}
        </div>
      )}

      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddContent}
      />
    </div>
  );
}
