import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()

  // Double vérification côté page en plus du middleware
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">
            Dashboard Admin
          </h1>
          <p className="text-neutral-400 text-sm">
            Connecté en tant que {session.user?.email}
          </p>
        </div>

        {/* On remplira ça avec les demandes de devis */}
        <div className="bg-neutral-800 rounded-xl p-6 text-neutral-400 text-center">
          Aucune demande de devis pour l'instant
        </div>
      </div>
    </div>
  )
}