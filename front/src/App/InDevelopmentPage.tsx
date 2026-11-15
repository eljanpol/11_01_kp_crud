import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InDevelopmentPage () {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-2xl px-4 py-8">
                <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
                <Link to="/home">
                    <ArrowLeft className="size-4" />
                    На главную
                </Link>
                </Button>
                <div className="max-w-xl">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        В разработке
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Сори
                    </p>
                </div>
            </main>
        </div>
    )
}