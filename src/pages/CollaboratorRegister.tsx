import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function CollaboratorRegister() {
  const { addCollaborator, collaborators, currentCollaboratorId } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', role: '', email: '', github: '', isManager: false })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const currentCollab = collaborators.find(c => c.id === currentCollaboratorId)
  const isManager = currentCollab?.isManager ?? !SUPABASE_CONFIGURED

  // Apenas gestores podem cadastrar colaboradores
  if (SUPABASE_CONFIGURED && !isManager) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Apenas gestores podem cadastrar colaboradores.</p>
          <button onClick={() => navigate('/collaborators')} className="btn-primary mt-4 text-sm">
            Voltar para lista
          </button>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await addCollaborator({ ...form, isManager: form.isManager })
      setSuccess(true)
      setTimeout(() => navigate('/collaborators'), 1500)
    } catch (err) {
      console.error('[CollaboratorRegister] addCollaborator error:', err)
      setError('Não foi possível cadastrar o colaborador. Verifique se o e-mail já está em uso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary-600 mb-6">Cadastrar Colaborador</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          Colaborador cadastrado com sucesso! Redirecionando...
        </div>
      )}

      {error && (
        <div className="mb-4 alert-warning flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-warning-700 hover:text-warning-900 ml-4">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Rafael Silva"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
          <input
            required
            type="text"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            placeholder="Ex: Desenvolvedor Frontend"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Ex: nome@sidi.org.br"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub *</label>
          <input
            required
            type="text"
            value={form.github}
            onChange={e => setForm({ ...form, github: e.target.value })}
            placeholder="@usuario"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isManager"
            type="checkbox"
            checked={form.isManager}
            onChange={e => setForm({ ...form, isManager: e.target.checked })}
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isManager" className="text-sm font-medium text-gray-700">
            Gestor (pode aprovar férias e cadastrar colaboradores)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Cadastrando…' : 'Cadastrar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/collaborators')}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
