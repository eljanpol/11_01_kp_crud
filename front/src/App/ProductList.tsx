import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, MapPin, PackageOpen } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Product = {
  id: number
  name: string
  description: string
  category: string
  storage_cell: string
  date_added: string // дата добавления в формате ISO
}

// Значение «Все категории» в выпадающем списке.
// Пустую строку Select использовать не позволяет, поэтому берём "all".
const ALL = "all"

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("http://localhost:8000/products/")

        if (!response.ok) {
          throw new Error("Ошибка сервера: " + response.status)
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError("Не удалось загрузить товары")
      }
    }

    loadProducts()
  }, [])

  const categories = [...new Set(products.map((product) => product.category))]
  const [category, setCategory] = useState<string>(ALL)

  // Фильтрация по категории + сортировка: новые товары сверху
  const visibleProducts = useMemo(() => {
    const filtered =
      category === ALL
        ? products
        : products.filter((product) => product.category === category)

    return [...filtered].sort(
      (a, b) =>
        new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
    )
  }, [products, category])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
          <Link to="/home">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Список товаров
            </h1>
            <p className="mt-2 text-muted-foreground">
              Найдено товаров: {visibleProducts.length}
            </p>
          </div>

          <div className="space-y-2 sm:w-56">
            <Label htmlFor="category-filter">Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Все категории</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && <p className="mt-8 text-center text-destructive">{error}</p>}
        {visibleProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <PackageOpen className="size-10" />
            <p>В этой категории пока нет товаров.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {visibleProducts.map((product) => (
              <li key={product.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      Ячейка {product.storage_cell}
                    </span>
                    <span>Добавлен: {formatDate(product.date_added)}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/providers">
                        О поставщике
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
