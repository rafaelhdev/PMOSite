import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function CollaboratorRegister() {
  const { addCollaborator } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', role: '', email: '', github: '' })
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addCollaborator(form)
    setSuccess(true)
    setTimeout(() => navigate('/collaborators'), 1500)
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary-600 mb-6">Cadastrar Colaborador</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          Colaborador cadastrado com sucesso! Redirecionando...
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

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Cadastrar
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
