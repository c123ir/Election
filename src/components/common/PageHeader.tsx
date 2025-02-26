import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  gradient: string;
  image?: string;
}

export function PageHeader({ title, description, icon: Icon, gradient, image }: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl shadow-lg mb-6 overflow-hidden`}>
      <div className="relative px-6 py-8 md:px-8">
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 space-x-reverse mb-2">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            </div>
            {description && (
              <p className="text-white/90 text-lg max-w-2xl">{description}</p>
            )}
          </div>
          {image && (
            <img
              src={image}
              alt={title}
              className="hidden md:block w-48 h-48 object-cover rounded-xl shadow-lg"
            />
          )}
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  );
}