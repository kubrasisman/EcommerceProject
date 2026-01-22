import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export interface Banner {
  id?: number | null
  code: number | null
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  displayOrder: number
  active: boolean
}

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  banner: Banner | null
  onSubmit: (b: Banner) => void
}

export const CreateBannerModal = ({ open, setOpen, banner, onSubmit }: Props) => {
  const [form, setForm] = useState<Banner>({
    id: null,
    code: null,
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    displayOrder: 0,
    active: true,
  })

  useEffect(() => {
    if (banner) {
      setForm(banner)
    } else {
      setForm({
        id: null,
        code: null,
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        displayOrder: 0,
        active: true,
      })
    }
  }, [banner])

  const handleChange = (key: keyof Banner, value: string | number | boolean) => {
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
          <DialogTitle>{banner ? "Edit Banner" : "Create Banner"}</DialogTitle>
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
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
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
          <div>
            <Label>Link URL</Label>
            <Input
              value={form.linkUrl}
              onChange={(e) => handleChange("linkUrl", e.target.value)}
              placeholder="/search?q=summer"
            />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input
              value={form.displayOrder}
              onChange={(e) => handleChange("displayOrder", Number(e.target.value))}
              type="number"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>{banner ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
