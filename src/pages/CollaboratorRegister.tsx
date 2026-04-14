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
        <div className="alert-success mb-4">
          Colaborador cadastrado com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Nome completo *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Rafael Silva"
            className="input"
          />
        </div>

        <div>
          <label className="label">Cargo *</label>
          <input
            required
            type="text"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            placeholder="Ex: Desenvolvedor Frontend"
            className="input"
          />
        </div>

        <div>
          <label className="label">E-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Ex: nome@sidi.org.br"
            className="input"
          />
        </div>

        <div>
          <label className="label">GitHub *</label>
          <input
            required
            type="text"
            value={form.github}
            onChange={e => setForm({ ...form, github: e.target.value })}
            placeholder="@usuario"
            className="input"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Cadastrar
          </button>
          <button type="button" onClick={() => navigate('/collaborators')} className="btn-secondary flex-1">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
