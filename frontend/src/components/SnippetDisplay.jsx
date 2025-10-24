import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import { Star, MoreVertical, Heart, Trash2, Edit, Copy, Check } from 'lucide-react';

const SnippetDisplay = ({ snippet, onToggleFavorite, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-xl font-semibold truncate">
                {snippet.title}
              </h1>
              {snippet.isFavorite && (
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {snippet.language}
              </Badge>
              {snippet.collection && (
                <Badge variant="outline">
                  {snippet.collection.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggleFavorite}>
                  {snippet.isFavorite ? (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Remove from Favorites
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Tags */}
          {snippet.tags && snippet.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Code */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Code</h3>
            <Card>
              <CardContent className="p-0">
                <SyntaxHighlighter
                  language={snippet.language.toLowerCase()}
                  style={atomOneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </div>

          {/* Explanation */}
          {snippet.explanation && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Explanation</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{snippet.explanation}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetDisplay;
