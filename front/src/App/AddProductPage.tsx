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

// Список категорий. Поменяй на свои.
const categories = [
  "Электроника",
  "Одежда",
  "Продукты",
  "Инструменты",
  "Канцелярия",
  "Другое",
]

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

  // Обновляет одно поле формы и убирает ошибку этого поля
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // TODO: отправить товар на сервер или сохранить в хранилище
    console.log("Новый товар:", {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      storage_cell: form.cell.trim(),
    })

    setForm(emptyForm)
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
