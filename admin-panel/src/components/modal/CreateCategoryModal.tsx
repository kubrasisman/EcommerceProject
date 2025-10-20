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

export interface Category {
  id: number | null
  code: number | null
  name: string | null
  description: string | null
}

interface CreateCategoryModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit?: (category: Category) => void
  category?: Category | null // düzenlenecek kategori (isteğe bağlı)
}

export function CreateCategoryModal({
  open,
  setOpen,
  onSubmit,
  category,
}: CreateCategoryModalProps) {
  const [formData, setFormData] = useState<Category>({
    id: null,
    code: null,
    name: "",
    description: "",
  })

  // Eğer "category" props geldiyse formu onunla doldur
  useEffect(() => {
    if (category) {
      setFormData(category)
    } else {
      setFormData({ id: null, code: null, name: "", description: "" })
    }
  }, [category, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? Number(value) : value, // code numeric olduğu için dönüştür
    }))
  }

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      alert("Code ve Name alanları zorunludur.")
      return
    }

    onSubmit?.(formData)
    setOpen(false)
    setFormData({ id: null, code: null, name: "", description: "" })
  }

  const isEditMode = Boolean(category)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
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
