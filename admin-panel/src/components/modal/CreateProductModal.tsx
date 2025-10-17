import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export interface Product {
  id?: number | null
  code: number | null
  name: string
  brand: string
  price: number
  description: string
  imageUrl: string
}

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  product: Product | null
  onSubmit: (p: Product) => void
}

export const CreateProductModal = ({ open, setOpen, product, onSubmit }: Props) => {
  const [form, setForm] = useState<Product>({
    id: null,
    code: null,
    name: "",
    brand: "",
    price: 0,
    description: "",
    imageUrl: "",
  })

  useEffect(() => {
    if (product) setForm(product)
  }, [product])

  const handleChange = (key: keyof Product, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
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
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>{product ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
