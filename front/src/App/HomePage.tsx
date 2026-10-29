import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Boxes,
  ChevronDown,
  List,
  LogOut,
  PackageMinus,
  PackagePlus,
  User,
  SquareChartGantt,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Разделы сайта. Поменяй пути (to) на свои маршруты.
const sections = [
  {
    to: "/products",
    title: "Список товаров",
    description: "Все товары на складе: названия, количество и остатки.",
    icon: List,
  },
  {
    to: "/products/new",
    title: "Добавить товар",
    description: "Оформить поступление и внести новый товар в систему.",
    icon: PackagePlus,
  },
  {
    to: "/products/delete",
    title: "Удалить товар",
    description: "Убрать из системы товар, которого больше нет на складе.",
    icon: PackageMinus,
  },
]

const adminSections = [
    {
        to: "/categories",
        title: "Управление категориями",
        description: "Все существующие категории, удаление и добавление новых.",
        icon: SquareChartGantt,
    },
]

type HomeProps = {
  /** Логин текущего пользователя */
  username?: string
  /** Вызывается при выходе из аккаунта */
  onLogout?: () => void
}

export default function HomePage({ username, onLogout }: HomeProps) {
    const navigate = useNavigate()
    username = "Janpol"
    const userRole = "admin"
  // Меню открывается при наведении на логин (и по клику — для тачскринов и клавиатуры)
    const [menuOpen, setMenuOpen] = useState(false)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined
    )

    const openMenu = () => {
        clearTimeout(closeTimer.current)
        setMenuOpen(true)
    }

  // Небольшая задержка, чтобы меню не закрывалось, пока курсор идёт от логина к пункту
    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setMenuOpen(false), 150)
    }

    const handleLogout = () => {
        // TODO: очистить токен / данные сессии
        onLogout?.()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                <Boxes className="size-5" />
                Учёт склада
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                {sections.map((section) => (
                    <Button key={section.to} variant="ghost" size="sm" asChild>
                    <Link to={section.to}>{section.title}</Link>
                    </Button>
                ))}
                </nav>
            </div>

            <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="gap-2"
                    onMouseEnter={openMenu}
                    onMouseLeave={closeMenu}
                >
                    <User className="size-4" />
                    {username}
                    <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                align="end"
                className="w-52"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
                >
                <DropdownMenuLabel className="font-normal text-muted-foreground">
                    Вы вошли как {username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="size-4" />
                    Выйти из аккаунта
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-12">
            <div className="max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight">
                Добро пожаловать, {username}
            </h1>
            <p className="mt-2 text-muted-foreground">
                Выберите, что нужно сделать со складом.
            </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ to, title, description, icon: Icon }) => (
                <Link
                key={to}
                to={to}
                className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                <Card className="h-full transition-colors hover:bg-accent">
                    <CardHeader>
                    <Icon className="mb-2 size-6" />
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    </CardHeader>
                </Card>
                </Link>
            ))}
            </div>

            {userRole === "admin" && (
                <>
                    <div className="max-w-xl, py-10">
                    <h3 className="text-3xl font-semibold tracking-tight">
                        Управление складом
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Доступно только администрации.
                    </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {adminSections.map(({ to, title, description, icon: Icon }) => (
                        <Link
                        key={to}
                        to={to}
                        className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                        <Card className="h-full transition-colors hover:bg-accent">
                            <CardHeader>
                            <Icon className="mb-2 size-6" />
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                            </CardHeader>
                        </Card>
                        </Link>
                    ))}
                    </div>
                </>
            )}
        </main>
        </div>
    )
}
