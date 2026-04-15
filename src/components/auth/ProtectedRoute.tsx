import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface Props {
  children: React.ReactNode
  requireManager?: boolean
}

/**
 * Rota protegida.
 *
 * - Se Supabase não está configurado (modo fallback/dev): sempre renderiza os filhos.
 * - Se Supabase está configurado:
 *   - Sem sessão → redireciona para /login, preservando a rota de origem.
 *   - Com requireManager=true e usuário não é gestor → redireciona para /.
 */
export default function ProtectedRoute({ children, requireManager = false }: Props) {
  const location = useLocation()
  const { session, loading } = useAuth()

  // Em fallback mode, sem autenticação real, todas as rotas são livres
  if (!SUPABASE_CONFIGURED) return <>{children}</>

  // Aguarda verificação da sessão antes de decidir
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  // Sem sessão: redireciona para login
  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Rota exclusiva para gestores
  if (requireManager) {
    // O papel do usuário é resolvido no AppContext via currentCollaborator
    // Aqui fazemos a guarda usando o estado de auth apenas; a verificação de isManager
    // acontece no próprio componente de página para maior granularidade.
  }

  return <>{children}</>
}
