
import React from 'react';
import { cn } from '@/lib/utils';
import { Globe, Instagram, Facebook, Twitter } from 'lucide-react';

interface SocialLinksProps {
  links: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Социальные сети</h3>
      <div className="flex space-x-3">
        {links.website && (
          <a 
            href={links.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "bg-gray-100 hover:bg-gray-200"
            )}
          >
            <Globe className="h-5 w-5 text-gray-700" />
          </a>
        )}
        
        {links.instagram && (
          <a 
            href={links.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            )}
          >
            <Instagram className="h-5 w-5 text-white" />
          </a>
        )}
        
        {links.facebook && (
          <a 
            href={links.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "bg-amber-600 hover:bg-amber-700"
            )}
          >
            <Facebook className="h-5 w-5 text-white" />
          </a>
        )}
        
        {links.twitter && (
          <a 
            href={links.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "bg-amber-400 hover:bg-amber-500"
            )}
          >
            <Twitter className="h-5 w-5 text-white" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;
