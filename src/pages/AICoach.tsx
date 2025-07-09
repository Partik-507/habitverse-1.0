
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';

export default function AICoach() {
  const [showEmbedded, setShowEmbedded] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Coach</h1>
            <p className="text-gray-600 dark:text-gray-400">Your intelligent productivity assistant powered by AI</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            onClick={() => setShowEmbedded(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Launch AI Assistant
          </Button>
          <Button variant="outline" asChild>
            <a href="https://hysts-mistral-7b.hf.space" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
              Smart Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Ask questions about productivity, get advice, and receive intelligent responses powered by advanced AI.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Bot className="mr-2 h-5 w-5 text-green-500" />
              Task Assistance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Get help with planning your day, managing tasks, and building better habits with AI guidance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
              Voice Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Use voice commands to interact with your AI assistant and dictate notes hands-free.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Embedded AI Assistant */}
      {showEmbedded ? (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">AI Assistant</CardTitle>
              <Button 
                onClick={() => setShowEmbedded(false)} 
                variant="outline" 
                size="sm"
              >
                Minimize
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src="https://hysts-mistral-7b.hf.space"
              width="100%"
              height="600"
              style={{ 
                border: 'none', 
                borderRadius: '0 0 8px 8px',
                background: '#ffffff'
              }}
              title="AI Assistant"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Ready to start your AI-powered productivity journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Launch the AI assistant to get personalized help with your tasks, habits, and goals. 
              You can also access it anytime using the floating chat button.
            </p>
            <Button 
              onClick={() => setShowEmbedded(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Launch AI Assistant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tips for Using Your AI Coach</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Ask for Productivity Tips</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              "Give me 5 ways to improve my daily routine" or "How can I build better habits?"
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">Get Motivational Support</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              "I'm feeling unmotivated today" or "Give me an inspiring quote"
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Plan Your Day</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              "Help me plan my day" or "What should I prioritize today?"
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">Learn New Skills</h3>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              "Teach me about time management" or "How do I set SMART goals?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
