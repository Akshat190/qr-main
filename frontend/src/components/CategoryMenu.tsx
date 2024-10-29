import React from 'react';
import { MenuCard } from './MenuCard';
import { MenuItem } from '../types';

interface CategoryMenuProps {
  title: string;
  items: MenuItem[];
}

export const CategoryMenu = ({ title, items }: CategoryMenuProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};