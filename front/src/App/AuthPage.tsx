import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Boxes } from "lucide-react"

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

type Mode = "login" | "users"

export default function AuthPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isRegister = mode === "users"

  const switchMode = () => {
    setMode(isRegister ? "login" : "users")
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim() || !password) {
      setError("Введите логин и пароль")
      return
    }
    if (isRegister && password.length < 6) {
      setError("Пароль должен быть не короче 6 символов")
      return
    }
    if (isRegister && password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("localhost:8000/${mode}", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (response.status === 401) {
        setError("Неверный логин или пароль")
        return
      }
      if (response.status === 409) {
        setError("Пользователь с таким логином уже существует")
        return
      }
      if (!response.ok) {
        throw new Error("Ошибка сервера: " + response.status)
      }

      navigate("/home")
    } catch (err) {
      console.error(err)
      setError("Не удалось выполнить запрос. Попробуйте позже")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold">
          <Boxes className="size-6" />
          Учёт склада
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isRegister ? "Регистрация" : "Вход в аккаунт"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Придумайте логин и пароль для входа в систему."
                : "Введите логин и пароль, чтобы продолжить."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Повторите пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Подождите…"
                  : isRegister
                    ? "Зарегистрироваться"
                    : "Войти"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {isRegister ? "Войти" : "Зарегистрироваться"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
