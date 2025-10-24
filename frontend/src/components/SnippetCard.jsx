import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Star, MoreVertical, Heart, Trash2, Edit } from 'lucide-react';

const SnippetCard = ({ 
  snippet, 
  isSelected, 
  onClick, 
  onToggleFavorite, 
  onDelete 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-primary bg-primary/5' 
            : 'hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-sm truncate">
                  {snippet.title}
                </h3>
                {snippet.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {snippet.language}
                </Badge>
                {snippet.collection && (
                  <Badge variant="outline" className="text-xs">
                    {snippet.collection.name}
                  </Badge>
                )}
              </div>

              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {snippet.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {snippet.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{snippet.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground line-clamp-2">
                {snippet.code.substring(0, 100)}
                {snippet.code.length > 100 && '...'}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}>
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
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SnippetCard;
