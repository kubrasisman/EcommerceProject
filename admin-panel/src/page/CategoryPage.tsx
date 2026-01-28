import React, { useEffect, useState } from "react"
import { CreateCategoryModal, type Category } from "@/components/modal/CreateCategoryModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Product {
  id: number
  code: number
  name: string
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryHierarchy, setCategoryHierarchy] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:8888/api/categories")
    setCategories(response.data)
  }

  const fetchHierarchy = async () => {
    const response = await axios.get("http://localhost:8888/api/categories/hierarchy")
    setCategoryHierarchy(response.data)
  }

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8888/api/products")
    const data = response.data
    // Normalize products response
    const productList = data.products || (Array.isArray(data) ? data : Object.values(data))
    setProducts(productList.map((p: any) => ({ id: p.id, code: p.code, name: p.name })))
  }

  useEffect(() => {
    fetchCategories()
    fetchHierarchy()
    fetchProducts()
  }, [])

  const toggleExpand = (code: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(code)) {
        newSet.delete(code)
      } else {
        newSet.add(code)
      }
      return newSet
    })
  }

  const refreshData = () => {
    fetchCategories()
    fetchHierarchy()
    fetchProducts()
  }

  const deleteCategory = (code: number | null) => {
    axios
      .delete(`http://localhost:8888/api/categories/remove/${code}`)
      .then((response) => {
        if (response.status === 200) {
          refreshData()
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

  // Get parent category names from codes
  const getParentCategoryNames = (parentCodes: number[] | null | undefined): string => {
    if (!parentCodes || parentCodes.length === 0) return "-"
    return parentCodes.map(code => {
      const cat = categories.find(c => c.code === code)
      return cat?.name || code.toString()
    }).join(", ")
  }

  const renderCategoryRow = (category: Category, depth: number = 0): React.ReactNode => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.code!)

    return (
      <React.Fragment key={category.id}>
        <tr className={depth > 0 ? "bg-gray-50" : ""}>
          <td className="border border-slate-300 px-4 py-2">{category.id}</td>
          <td className="border border-slate-300 px-4 py-2">{category.code}</td>
          <td className="border border-slate-300 px-4 py-2">
            <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.code!)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="w-7" />
              )}
              <span className="font-medium">{category.name}</span>
              {hasChildren && (
                <span className="ml-2 text-xs text-gray-500">
                  ({category.children!.length} alt kategori)
                </span>
              )}
            </div>
          </td>
          <td className="border border-slate-300 px-4 py-2 text-center">
            {category.type === 'BRAND' ? (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Marka
              </span>
            ) : (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Kategori
              </span>
            )}
          </td>
          <td className="border border-slate-300 px-4 py-2">
            {getParentCategoryNames(category.parentCategoryCodes)}
          </td>
          <td className="border border-slate-300 px-4 py-2">{category.description}</td>
          <td className="border border-slate-300 px-4 py-2 text-center">
            {category.productCodes && category.productCodes.length > 0 ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {category.productCodes.length} ürün
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
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
        {hasChildren && isExpanded && category.children!.map((child) => renderCategoryRow(child, depth + 1))}
      </React.Fragment>
    )
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
              <th className="border border-slate-300 px-4 py-2">Type</th>
              <th className="border border-slate-300 px-4 py-2">Parent Categories</th>
              <th className="border border-slate-300 px-4 py-2">Description</th>
              <th className="border border-slate-300 px-4 py-2">Products</th>
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryHierarchy.map((category) => renderCategoryRow(category, 0))}
          </tbody>
        </table>
      </div>

      <CreateCategoryModal
        open={modalOpen}
        setOpen={setModalOpen}
        category={selectedCategory}
        allCategories={categories}
        allProducts={products}
        onSubmit={handleSubmit}
        onSuccess={refreshData}
      />
    </div>
  )
}

export default CategoryPage
