import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Category } from '@/types/category.types'

interface CategoryMegaMenuProps {
  categories: Category[]
  onClose: () => void
}

export default function CategoryMegaMenu({ categories, onClose }: CategoryMegaMenuProps) {
  // Track hovered category at each level
  const [hoveredPath, setHoveredPath] = useState<Category[]>([])

  const getCategoryUrl = (category: Category) => {
    // Use category code for more reliable search
    return `/search?categoryCode=${category.code}`
  }

  const handleHover = (category: Category, level: number) => {
    // Update the path up to this level
    setHoveredPath(prev => [...prev.slice(0, level), category])
  }

  // Build columns: first column is root categories, then each hovered category's children
  const columns: Category[][] = [categories]
  hoveredPath.forEach(cat => {
    if (cat.children && cat.children.length > 0) {
      columns.push(cat.children)
    }
  })

  return (
    <div className="absolute top-full left-0 mt-1 bg-white text-gray-900 shadow-xl rounded-md z-50 flex max-w-[900px] overflow-x-auto">
      {columns.map((columnCategories, columnIndex) => (
        <div
          key={columnIndex}
          className={`w-56 flex-shrink-0 py-2 ${
            columnIndex < columns.length - 1 ? 'border-r border-gray-200' : ''
          } ${columnIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
        >
          {columnCategories.map((category) => {
            const isHovered = hoveredPath[columnIndex]?.code === category.code
            const hasChildren = category.children && category.children.length > 0

            return (
              <div
                key={category.code}
                onMouseEnter={() => handleHover(category, columnIndex)}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                  isHovered ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <Link
                  to={getCategoryUrl(category)}
                  onClick={onClose}
                  className={`flex-1 text-sm ${columnIndex === 0 ? 'font-medium' : ''}`}
                >
                  {category.name}
                </Link>
                {hasChildren && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}