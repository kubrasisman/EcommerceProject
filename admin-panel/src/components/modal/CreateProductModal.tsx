import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface CategorySimple {
  code: number
  name: string
  level?: number
  children?: CategorySimple[]
}

export interface Product {
  id?: number | null
  code: number | null
  name: string
  brand: string
  price: number
  description: string
  imageUrl: string
  categoryCodes?: number[] | { code: number; name: string }[]
}

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  product: Product | null
  categories: CategorySimple[]
  onSubmit: (p: Product) => void
}

export const CreateProductModal = ({ open, setOpen, product, categories, onSubmit }: Props) => {
  const [form, setForm] = useState<Product>({
    id: null,
    code: null,
    name: "",
    brand: "",
    price: 0,
    description: "",
    imageUrl: "",
    categoryCodes: [],
  })
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  useEffect(() => {
    if (product) {
      setForm(product)
      // Extract category codes from product
      const codes = product.categoryCodes?.map(c =>
        typeof c === 'number' ? c : c.code
      ) || []
      setSelectedCategories(codes)
    } else {
      setForm({
        id: null,
        code: null,
        name: "",
        brand: "",
        price: 0,
        description: "",
        imageUrl: "",
        categoryCodes: [],
      })
      setSelectedCategories([])
    }
  }, [product, open])

  const handleChange = (key: keyof Product, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleCategoryToggle = (code: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  const handleSubmit = () => {
    onSubmit({
      ...form,
      categoryCodes: selectedCategories
    })
    setOpen(false)
  }

  // Flatten categories for display
  const flattenCategories = (cats: CategorySimple[], depth = 0): { category: CategorySimple; depth: number }[] => {
    const result: { category: CategorySimple; depth: number }[] = []
    for (const cat of cats) {
      result.push({ category: cat, depth })
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, depth + 1))
      }
    }
    return result
  }

  const flatCategories = flattenCategories(categories)

  // Get selected category names for display
  const getSelectedCategoryNames = () => {
    const findCategory = (cats: CategorySimple[], code: number): CategorySimple | null => {
      for (const cat of cats) {
        if (cat.code === code) return cat
        if (cat.children) {
          const found = findCategory(cat.children, code)
          if (found) return found
        }
      }
      return null
    }

    return selectedCategories.map(code => {
      const cat = findCategory(categories, code)
      return cat?.name || code.toString()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Code</Label>
            <Input
              value={form.code ?? ""}
              onChange={(e) => handleChange("code", Number(e.target.value))}
              type="number"
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Brand</Label>
            <Input
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              value={form.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              type="number"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
            />
          </div>

          {/* Category Selection */}
          <div>
            <Label>Kategoriler</Label>

            {/* Selected categories */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {getSelectedCategoryNames().map((name, idx) => (
                  <span
                    key={selectedCategories[idx]}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(selectedCategories[idx])}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Category list */}
            <div className="border rounded-md max-h-48 overflow-y-auto mt-2">
              {flatCategories.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">Kategori bulunamadı</div>
              ) : (
                flatCategories.map(({ category, depth }) => (
                  <label
                    key={category.code}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    style={{ paddingLeft: `${12 + depth * 16}px` }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.code)}
                      onChange={() => handleCategoryToggle(category.code)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {depth > 0 && <span className="text-gray-400 mr-1">{"—".repeat(depth)}</span>}
                      {category.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit}>{product ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}