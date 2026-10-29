import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Category = {
  id: number
  name: string
  description: string
}

type ProductForm = {
  name: string
  description: string
  category: string
  cell: string
}

type FormErrors = Partial<Record<keyof ProductForm, string>>

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "",
  cell: "",
}

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [allCategories, setAllCategories] = useState<Category[]>([])

  async function getCategories() {
    try{
      const response = await fetch("http://localhost:8000/category")

      if(!response.ok){
        throw new Error("Ошибка сервера: " + response.status)
      }
      const data = await response.json()
      setAllCategories(data)
    }
    catch(err){
      console.log(err)
    }
  }

  getCategories()

  const categories = allCategories.map((category) => category.name)

  const update = (field: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): FormErrors => {
    const result: FormErrors = {}
    if (!form.name.trim()) result.name = "Введите название товара"
    if (!form.category) result.category = "Выберите категорию"
    if (!form.cell.trim()) result.cell = "Введите номер ячейки"
    return result
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try{
      const response = await fetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          storage_cell: form.cell.trim()
        }),
      })

      if (!response.ok){
        throw new Error("Ошибка сервера: " + response.status)
      }
      setForm(emptyForm)
    }

    catch(err){
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
          <Link to="/home">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Добавить товар</CardTitle>
            <CardDescription>
              Заполните данные о товаре и добавьте его в систему.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Например, Ноутбук Lenovo"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
        
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Краткое описание товара"
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => update("category", value)}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full"
                    aria-invalid={!!errors.category}
                  >
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell">Номер ячейки на складе</Label>
                <Input
                  id="cell"
                  placeholder="Например, A-12"
                  value={form.cell}
                  onChange={(e) => update("cell", e.target.value)}
                  aria-invalid={!!errors.cell}
                />
                {errors.cell && (
                  <p className="text-sm text-destructive">{errors.cell}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Добавить товар
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
