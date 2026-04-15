import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { VacationStatusBadge, FluigStatusBadge } from '../components/ui/StatusBadge'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function CollaboratorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { collaborators, vacations, currentCollaboratorId, deleteCollaborator } = useApp()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const collaborator = collaborators.find(c => c.id === id)
  if (!collaborator) return <div className="text-gray-500">Colaborador não encontrado.</div>

  const currentCollab = collaborators.find(c => c.id === currentCollaboratorId)
  const isManager = currentCollab?.isManager ?? !SUPABASE_CONFIGURED

  const myVacations = vacations.filter(v => v.collaboratorId === id)
  const backupVacations = vacations.filter(v => v.backupId === id)

  async function handleDeleteCollaborator() {
    setDeleteError(null)
    try {
      await deleteCollaborator(collaborator!.id)
      navigate('/collaborators')
    } catch (err) {
      console.error('[CollaboratorProfile] deleteCollaborator error:', err)
      setDeleteError('Não foi possível excluir o colaborador. Verifique suas permissões.')
      setConfirmDelete(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
          ← Voltar
        </button>

        {/* Botão de exclusão visível apenas para gestores */}
        {isManager && (
          !confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
              Excluir colaborador
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 font-medium">Confirmar exclusão?</span>
              <button onClick={handleDeleteCollaborator} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                Sim, excluir
              </button>
              <button onClick={() => setConfirmDelete(false)} className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          )
        )}
      </div>

      {deleteError && (
        <div className="mb-4 alert-warning flex items-center justify-between">
          <span>⚠️ {deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-warning-700 hover:text-warning-900 ml-4">✕</button>
        </div>
      )}

      {/* Profile card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
            {getInitials(collaborator.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{collaborator.name}</h1>
              {collaborator.isManager && (
                <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                  ⭐ Gestor
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{collaborator.role}</p>
            <p className="text-gray-400 text-xs mt-1">{collaborator.email}</p>
            <p className="text-gray-400 text-xs">{collaborator.github}</p>
          </div>
        </div>
      </div>

      {/* Vacation history */}
      <h2 className="text-lg font-semibold text-primary-600 mb-3">Histórico de Férias</h2>
      {myVacations.length === 0 ? (
        <div className="card text-center text-gray-400 text-sm mb-6">
          Nenhuma férias registrada.
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {myVacations.map(v => {
            const backup = collaborators.find(c => c.id === v.backupId)
            return (
              <div key={v.id} className="card">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {formatDate(v.startDate)} → {formatDate(v.endDate)}
                    </p>
                    {backup && <p className="text-xs text-gray-500 mt-0.5">Backup: {backup.name}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <VacationStatusBadge status={v.status} />
                    <FluigStatusBadge status={v.fluigStatus} />
                  </div>
                </div>
                {v.fluigProtocol && (
                  <p className="text-xs text-gray-400 mt-2">Protocolo Fluig: {v.fluigProtocol}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Backup duties */}
      {backupVacations.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-primary-600 mb-3">Backup de Colegas</h2>
          <div className="space-y-3">
            {backupVacations.map(v => {
              const owner = collaborators.find(c => c.id === v.collaboratorId)
              return (
                <div key={v.id} className="bg-secondary-50 border border-secondary-300 rounded-xl p-4">
                  <p className="text-sm font-medium text-secondary-600">
                    Backup de <strong>{owner?.name}</strong>
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {formatDate(v.startDate)} → {formatDate(v.endDate)}
                  </p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
