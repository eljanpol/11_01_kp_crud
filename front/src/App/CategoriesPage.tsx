import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
import { Textarea } from "@/components/ui/textarea"

type Category = {
  id: number
  name: string
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:8000/category/", {credentials: "include"})

      if (!response.ok) {
        throw new Error("Ошибка сервера: " + response.status)
      }

      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
      setError("Не удалось загрузить категории")
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите название категории")
      return
    }


    try {
      const response = await fetch("http://localhost:8000/category/", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка сервера: " + response.status)
      }

      setName("")
      setDescription("")
      setError("")
      await loadCategories()
    } catch (err) {
      console.error(err)
      setError("Не удалось создать категорию")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
          <Link to="/home">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight">
          Управление категориями
        </h1>
        <p className="mt-2 text-muted-foreground">
          Создавайте новые категории и удаляйте ненужные.
        </p>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Новая категория</CardTitle>
            <CardDescription>
              Укажите название и, если нужно, описание.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Название</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Электроника"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">Описание</Label>
                <Textarea
                  id="category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Что входит в эту категорию (необязательно)"
                  rows={3}
                />
              </div>

              <Button type="submit">Создать категорию</Button>
            </form>
          </CardContent>
        </Card>

        <h2 className="mt-10 text-xl font-semibold">
          Все категории ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Категорий пока нет.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          {category.description || "Без описания"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
