import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { VacationStatusBadge, FluigStatusBadge } from '../components/ui/StatusBadge'
import type { Vacation, VacationStatus } from '../types'

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

function datesOverlap(s1: string, e1: string, s2: string, e2: string) {
  return s1 <= e2 && e1 >= s2
}

export default function VacationManagement() {
  const { collaborators, vacations, currentCollaboratorId, addVacation, updateVacation } = useApp()
  const currentCollab = collaborators.find(c => c.id === currentCollaboratorId)!

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', backupId: '' })
  const [conflict, setConflict] = useState<string | null>(null)

  const myVacations = vacations.filter(v => v.collaboratorId === currentCollaboratorId)

  // Backup notifications: vacations where I'm the backup
  const backupNotifications = vacations.filter(v =>
    v.backupId === currentCollaboratorId && v.status !== 'denied'
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.startDate || !form.endDate) return
    if (form.startDate > form.endDate) {
      setConflict('A data de início deve ser anterior à data de fim.')
      return
    }

    // Conflict detection: check other collaborators in same period
    const conflicts = vacations.filter(v =>
      v.collaboratorId !== currentCollaboratorId &&
      v.status !== 'denied' &&
      datesOverlap(form.startDate, form.endDate, v.startDate, v.endDate)
    )
    if (conflicts.length > 0) {
      const names = conflicts.map(v => collaborators.find(c => c.id === v.collaboratorId)?.name).filter(Boolean).join(', ')
      setConflict(`Atenção: conflito com férias de ${names}. O time pode ficar sem cobertura. Confirme para continuar mesmo assim.`)
    } else {
      setConflict(null)
      submitVacation()
    }
  }

  function submitVacation() {
    addVacation({
      collaboratorId: currentCollaboratorId,
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'intention',
      backupId: form.backupId || undefined,
      fluigStatus: 'not_sent',
    })
    setForm({ startDate: '', endDate: '', backupId: '' })
    setConflict(null)
    setShowForm(false)
  }

  function handleConfirmApproval(id: string) {
    updateVacation(id, { status: 'confirmed' })
  }

  function handleDeny(id: string) {
    updateVacation(id, { status: 'denied' })
  }

  function handleOpenFluig(v: Vacation) {
    const protocol = `FLG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`
    updateVacation(v.id, { fluigStatus: 'pending', fluigProtocol: protocol })
    alert(`Solicitação enviada ao Fluig!\nProtocolo: ${protocol}`)
  }

  function handleFluigApprove(id: string) {
    updateVacation(id, { fluigStatus: 'approved' })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">Minhas Férias</h1>
          <p className="text-sm text-gray-500 mt-0.5">{currentCollab?.name}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Registrar Intenção'}
        </button>
      </div>

      {/* Backup notifications banner */}
      {backupNotifications.length > 0 && (
        <div className="mb-6 space-y-2">
          {backupNotifications.map(v => {
            const owner = collaborators.find(c => c.id === v.collaboratorId)
            return (
              <div key={v.id} className="bg-blue-50 border border-blue-300 rounded-xl p-4 flex items-start gap-3">
                <span className="text-blue-500 text-lg">🔔</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Você é backup de <strong>{owner?.name}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {formatDate(v.startDate)} → {formatDate(v.endDate)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Vacation intention form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Nova Intenção de Férias</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de início *</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de fim *</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup</label>
              <select
                value={form.backupId}
                onChange={e => setForm({ ...form, backupId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione um backup (opcional)</option>
                {collaborators.filter(c => c.id !== currentCollaboratorId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {conflict && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ {conflict}
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={submitVacation} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700">
                    Confirmar mesmo assim
                  </button>
                  <button type="button" onClick={() => setConflict(null)} className="border border-yellow-400 text-yellow-700 px-3 py-1 rounded text-xs hover:bg-yellow-100">
                    Alterar datas
                  </button>
                </div>
              </div>
            )}

            {!conflict && (
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Registrar Intenção
              </button>
            )}
          </form>
        </div>
      )}

      {/* My vacations list */}
      {myVacations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
          Nenhuma férias registrada. Clique em "+ Registrar Intenção" para começar.
        </div>
      ) : (
        <div className="space-y-4">
          {myVacations.map(v => {
            const backup = collaborators.find(c => c.id === v.backupId)
            return (
              <div key={v.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-800">
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
                  <p className="text-xs text-gray-400 mb-3">Protocolo Fluig: {v.fluigProtocol}</p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {/* Confirm approval — available when status is 'approved' */}
                  {v.status === 'approved' && (
                    <button
                      onClick={() => handleConfirmApproval(v.id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                      ✓ Confirmar Aprovação
                    </button>
                  )}

                  {/* Deny own intention */}
                  {(v.status === 'intention') && (
                    <button
                      onClick={() => handleDeny(v.id)}
                      className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}

                  {/* Approve (manager action — simulated) */}
                  {v.status === 'intention' && (
                    <button
                      onClick={() => updateVacation(v.id, { status: 'approved' as VacationStatus })}
                      className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
                    >
                      Aprovar (gestor)
                    </button>
                  )}

                  {/* Open Fluig request */}
                  {v.fluigStatus === 'not_sent' && v.status !== 'denied' && (
                    <button
                      onClick={() => handleOpenFluig(v)}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                      Abrir no Fluig
                    </button>
                  )}

                  {/* Simulate Fluig approval */}
                  {v.fluigStatus === 'pending' && (
                    <button
                      onClick={() => handleFluigApprove(v.id)}
                      className="border border-orange-400 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-50 transition-colors"
                    >
                      Fluig: Simular Aprovação
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
