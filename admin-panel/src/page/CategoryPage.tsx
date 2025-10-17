import { CreateCategoryModal, type Category } from "@/components/modal/CreateCategoryModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:8888/api/categories")
      setCategories(response.data)
    }
    fetchCategories()
  }, [])

  const deleteCategory = (code: number | null) => {
    axios
      .delete(`http://localhost:8888/api/categories/remove/${code}`)
      .then((response) => {
        if (response.status === 200) {
          setCategories((prev) => prev.filter((cat) => cat.code !== code))
        }
      })
  }

  const handleSubmit = (category: Category) => {
    // Eğer ID varsa -> güncelleme
    if (category.id) {
      axios
        .post("http://localhost:8888/api/categories/update", category)
        .then((response) => {
          if (response.status === 200) {
            setCategories((prev) =>
              prev.map((cat) =>
                cat.id === category.id ? response.data : cat
              )
            )
          }
        })
    } else {
      // Yeni kayıt
      axios
        .post("http://localhost:8888/api/categories/save", category)
        .then((response) => {
          if (response.status === 200) {
            setCategories((prev) => [...prev, response.data])
          }
        })
    }
  }

  return (
    <div className="flex w-screen flex-col ps-10 pe-10 pt-6 pb-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Category Page</h1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setSelectedCategory(null)
            setModalOpen(true)
          }}
        >
          Create Category
        </Button>
      </div>

      <div className="mt-10">
        <table className="w-full table-auto border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-300 px-4 py-2">ID</th>
              <th className="border border-slate-300 px-4 py-2">Code</th>
              <th className="border border-slate-300 px-4 py-2">Name</th>
              <th className="border border-slate-300 px-4 py-2">Description</th>
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-slate-300 px-4 py-2">{category.id}</td>
                <td className="border border-slate-300 px-4 py-2">{category.code}</td>
                <td className="border border-slate-300 px-4 py-2">{category.name}</td>
                <td className="border border-slate-300 px-4 py-2">{category.description}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(category.code)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setSelectedCategory(category)
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

      <CreateCategoryModal
        open={modalOpen}
        setOpen={setModalOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default CategoryPage
