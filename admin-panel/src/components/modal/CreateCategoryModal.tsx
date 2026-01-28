import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductSimple {
  id: number
  code: number
  name: string
}

export type CategoryType = 'CATEGORY' | 'BRAND'

export interface Category {
  id: number | null
  code: number | null
  name: string | null
  description: string | null
  parentCategoryCodes?: number[] | null
  type?: CategoryType
  children?: Category[]
  productCodes?: number[]
}

interface CreateCategoryModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit?: (category: Category) => void
  onSuccess?: () => void
  category?: Category | null
  allCategories?: Category[]
  allProducts?: ProductSimple[]
}

export function CreateCategoryModal({
  open,
  setOpen,
  onSubmit,
  onSuccess,
  category,
  allCategories = [],
  allProducts = [],
}: CreateCategoryModalProps) {
  const [formData, setFormData] = useState<Category>({
    id: null,
    code: null,
    name: "",
    description: "",
    parentCategoryCodes: [],
    productCodes: [],
    type: 'CATEGORY',
  })
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [selectedParentCategories, setSelectedParentCategories] = useState<number[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [parentSearch, setParentSearch] = useState("")

  // Filter categories that can be parents (exclude self to prevent circular reference)
  const availableParents = allCategories.filter(
    (cat) => cat.code !== category?.code
  )

  // Populate form when category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        ...category,
        parentCategoryCodes: category.parentCategoryCodes ?? [],
        type: category.type || 'CATEGORY',
      })
      setSelectedProducts(category.productCodes || [])
      setSelectedParentCategories(category.parentCategoryCodes || [])
    } else {
      setFormData({ id: null, code: null, name: "", description: "", parentCategoryCodes: [], productCodes: [], type: 'CATEGORY' })
      setSelectedProducts([])
      setSelectedParentCategories([])
    }
  }, [category, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? (value === "" ? null : Number(value)) : value,
    }))
  }

  const handleProductToggle = (code: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  const handleParentCategoryToggle = (code: number) => {
    setSelectedParentCategories(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      alert("Code ve Name alanları zorunludur.")
      return
    }

    onSubmit?.({
      ...formData,
      parentCategoryCodes: selectedParentCategories.length > 0 ? selectedParentCategories : null,
      productCodes: selectedProducts
    })
    onSuccess?.()
    setOpen(false)
    setFormData({ id: null, code: null, name: "", description: "", parentCategoryCodes: [], productCodes: [], type: 'CATEGORY' })
    setSelectedProducts([])
    setSelectedParentCategories([])
  }

  const isEditMode = Boolean(category)

  // Filter products by search
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.code.toString().includes(productSearch)
  )

  // Filter parent categories by search
  const filteredParentCategories = availableParents.filter(cat =>
    (cat.name?.toLowerCase() || "").includes(parentSearch.toLowerCase()) ||
    (cat.code?.toString() || "").includes(parentSearch)
  )

  // Get selected parent category names
  const getSelectedParentCategoryNames = () => {
    return selectedParentCategories.map(code => {
      const cat = allCategories.find(c => c.code === code)
      return cat?.name || code.toString()
    })
  }

  // Get selected product names
  const getSelectedProductNames = () => {
    return selectedProducts.map(code => {
      const product = allProducts.find(p => p.code === code)
      return product?.name || code.toString()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Kategoriyi Düzenle" : "Yeni Kategori Oluştur"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Kategori bilgilerini güncelleyin."
              : "Yeni bir kategori eklemek için aşağıdaki alanları doldurun."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Code */}
          <div className="grid gap-2">
            <Label htmlFor="code">Kod</Label>
            <Input
              id="code"
              name="code"
              placeholder="örn. 1001"
              value={formData.code ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Ad</Label>
            <Input
              id="name"
              name="name"
              placeholder="örn. Araç Parçaları"
              value={formData.name ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Tip</Label>
            <select
              id="type"
              name="type"
              className="border border-input bg-background rounded-md p-2 text-sm"
              value={formData.type || 'CATEGORY'}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CategoryType }))}
            >
              <option value="CATEGORY">Kategori</option>
              <option value="BRAND">Marka (Brand)</option>
            </select>
            <p className="text-xs text-gray-500">
              Marka olarak isaretlenen kategoriler code=2 altina baglanmali ve navbar'da "Brands" bolumunde gosterilir.
            </p>
          </div>

          {/* Parent Categories - Multiple Selection */}
          <div className="grid gap-2">
            <Label>Ust Kategoriler (Coklu Secim)</Label>

            {/* Selected parent categories */}
            {selectedParentCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {getSelectedParentCategoryNames().map((name, idx) => (
                  <span
                    key={selectedParentCategories[idx]}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => handleParentCategoryToggle(selectedParentCategories[idx])}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Parent category search */}
            <Input
              placeholder="Ust kategori ara..."
              value={parentSearch}
              onChange={(e) => setParentSearch(e.target.value)}
              className="mb-2"
            />

            {/* Parent category list */}
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {filteredParentCategories.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">Kategori bulunamadi</div>
              ) : (
                filteredParentCategories.slice(0, 50).map((cat) => (
                  <label
                    key={cat.code}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParentCategories.includes(cat.code!)}
                      onChange={() => handleParentCategoryToggle(cat.code!)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {cat.name}
                      <span className="text-gray-400 ml-1">({cat.code})</span>
                    </span>
                  </label>
                ))
              )}
              {filteredParentCategories.length > 50 && (
                <div className="p-2 text-center text-xs text-gray-400">
                  +{filteredParentCategories.length - 50} daha... (arama yapin)
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Bos birakirsaniz bagimsiz kategori olarak olusturulur. Musteri sitesinde gorunmesi icin code=1 kategorisine baglayin.
            </p>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              name="description"
              className="border border-input bg-background rounded-md p-2 text-sm min-h-[80px]"
              placeholder="Kategori hakkında kısa açıklama..."
              value={formData.description ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Products */}
          <div className="grid gap-2">
            <Label>Urunler</Label>

            {/* Selected products */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {getSelectedProductNames().map((name, idx) => (
                  <span
                    key={selectedProducts[idx]}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => handleProductToggle(selectedProducts[idx])}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Product search */}
            <Input
              placeholder="Urun ara..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="mb-2"
            />

            {/* Product list */}
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">Urun bulunamadi</div>
              ) : (
                filteredProducts.slice(0, 50).map((product) => (
                  <label
                    key={product.code}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.code)}
                      onChange={() => handleProductToggle(product.code)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {product.name}
                      <span className="text-gray-400 ml-1">({product.code})</span>
                    </span>
                  </label>
                ))
              )}
              {filteredProducts.length > 50 && (
                <div className="p-2 text-center text-xs text-gray-400">
                  +{filteredProducts.length - 50} daha... (arama yapin)
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Güncelle" : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
