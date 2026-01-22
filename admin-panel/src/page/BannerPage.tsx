import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"
import { CreateBannerModal, type Banner } from "@/components/modal/CreateBannerModal"

const BannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  const normalizeBanners = (payload: any): Banner[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (payload.data && Array.isArray(payload.data)) return payload.data
    if (payload.banners && Array.isArray(payload.banners)) return payload.banners
    if (typeof payload === "object") {
      return Object.values(payload).filter((b) => b && typeof b === "object") as Banner[]
    }
    return []
  }

  useEffect(() => {
    const fetchBanners = async () => {
      const response = await axios.get("http://localhost:8888/api/banners/all")
      setBanners(normalizeBanners(response.data))
    }
    fetchBanners()
  }, [])

  const deleteBanner = (code: number | null | undefined) => {
    if (!code) return
    axios
      .delete(`http://localhost:8888/api/banners/remove/${code}`)
      .then((response) => {
        if (response.status === 200) {
          setBanners((prev) => {
            const arr = Array.isArray(prev) ? prev : (Object.values(prev as any) as Banner[])
            return arr.filter((b) => b.code !== code)
          })
        }
      })
  }

  const handleSubmit = (banner: Banner) => {
    if (banner.id) {
      axios
        .post("http://localhost:8888/api/banners/update", banner)
        .then((response) => {
          if (response.status === 200) {
            setBanners((prev) => {
              const arr = Array.isArray(prev) ? prev : (Object.values(prev as any) as Banner[])
              return arr.map((b) => (b.id === banner.id ? response.data : b))
            })
          }
        })
    } else {
      axios
        .post("http://localhost:8888/api/banners/save", banner)
        .then((response) => {
          if (response.status === 200) {
            setBanners((prev) => {
              const arr = Array.isArray(prev) ? prev : (Object.values(prev as any) as Banner[])
              return [...arr, response.data]
            })
          }
        })
    }
  }

  const bannersList: Banner[] = Array.isArray(banners) ? banners : (Object.values(banners as any) as Banner[])

  return (
    <div className="flex w-screen flex-col ps-10 pe-10 pt-6 pb-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Banner Page</h1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setSelectedBanner(null)
            setModalOpen(true)
          }}
        >
          Create Banner
        </Button>
      </div>

      <div className="mt-10">
        <table className="w-full table-auto border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-300 px-4 py-2">ID</th>
              <th className="border border-slate-300 px-4 py-2">Code</th>
              <th className="border border-slate-300 px-4 py-2">Title</th>
              <th className="border border-slate-300 px-4 py-2">Description</th>
              <th className="border border-slate-300 px-4 py-2">Image</th>
              <th className="border border-slate-300 px-4 py-2">Link URL</th>
              <th className="border border-slate-300 px-4 py-2">Order</th>
              <th className="border border-slate-300 px-4 py-2">Active</th>
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannersList.map((banner) => (
              <tr key={banner.id}>
                <td className="border border-slate-300 px-4 py-2">{banner.id}</td>
                <td className="border border-slate-300 px-4 py-2">{banner.code}</td>
                <td className="border border-slate-300 px-4 py-2">{banner.title}</td>
                <td className="border border-slate-300 px-4 py-2">
                  {banner.description?.length > 30
                    ? banner.description.substring(0, 30) + "..."
                    : banner.description}
                </td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-slate-300 px-4 py-2">{banner.linkUrl}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">{banner.displayOrder}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBanner(banner.code)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setSelectedBanner(banner)
                      setModalOpen(true)
                    }}
                  >
                    Düzenle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateBannerModal
        open={modalOpen}
        setOpen={setModalOpen}
        banner={selectedBanner}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default BannerPage