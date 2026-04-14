import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { VacationStatusBadge } from '../components/ui/StatusBadge'

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function Dashboard() {
  const { collaborators, vacations, currentCollaboratorId } = useApp()
  const today = new Date().toISOString().slice(0, 10)

  const onVacationNow = vacations.filter(v =>
    v.startDate <= today && v.endDate >= today && v.status !== 'denied'
  )

  const upcoming = vacations
    .filter(v => v.startDate > today && v.status !== 'denied')
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5)

  const pending = vacations.filter(v => v.status === 'intention')

  const backupNotifications = vacations.filter(v =>
    v.backupId === currentCollaboratorId && v.status !== 'denied' && v.endDate >= today
  )

  const statCards = [
    { label: 'Colaboradores',       value: collaborators.length,    color: 'bg-primary-50 border-primary-200',     text: 'text-primary-600' },
    { label: 'De férias agora',      value: onVacationNow.length,   color: 'bg-warning-50 border-warning-500',     text: 'text-warning-700' },
    { label: 'Próximas férias',      value: upcoming.length,        color: 'bg-secondary-50 border-secondary-300', text: 'text-secondary-600' },
    { label: 'Aguardando aprovação', value: pending.length,         color: 'bg-danger-50 border-danger-500',       text: 'text-danger-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-600 mb-6">Dashboard</h1>

      {/* Backup alert */}
      {backupNotifications.length > 0 && (
        <div className="mb-6 bg-secondary-50 border border-secondary-300 rounded-xl p-4">
          <p className="text-secondary-600 font-medium text-sm mb-1">🔔 Você tem responsabilidade de backup</p>
          {backupNotifications.map(v => {
            const owner = collaborators.find(c => c.id === v.collaboratorId)
            return (
              <p key={v.id} className="text-xs text-secondary-500">
                Backup de <strong>{owner?.name}</strong>: {formatDate(v.startDate)} → {formatDate(v.endDate)}
              </p>
            )
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Currently on vacation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">De Férias Agora</h2>
          {onVacationNow.length === 0 ? (
            <p className="text-gray-400 text-sm">Ninguém de férias no momento.</p>
          ) : (
            <ul className="space-y-3">
              {onVacationNow.map(v => {
                const c = collaborators.find(col => col.id === v.collaboratorId)
                const backup = collaborators.find(col => col.id === v.backupId)
                return (
                  <li key={v.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c?.name}</p>
                      <p className="text-xs text-gray-500">até {formatDate(v.endDate)}</p>
                      {backup && <p className="text-xs text-gray-400">Backup: {backup.name}</p>}
                    </div>
                    <VacationStatusBadge status={v.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Upcoming vacations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Próximas Férias</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhuma férias agendada.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map(v => {
                const c = collaborators.find(col => col.id === v.collaboratorId)
                return (
                  <li key={v.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c?.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(v.startDate)} → {formatDate(v.endDate)}</p>
                    </div>
                    <VacationStatusBadge status={v.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Consolidated team view by period */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Visão Consolidada do Time</h2>
            <Link to="/calendar" className="text-xs text-primary-500 hover:text-primary-600">Ver calendário →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-500 font-medium py-2 pr-4">Colaborador</th>
                  <th className="text-left text-gray-500 font-medium py-2 pr-4">Período</th>
                  <th className="text-left text-gray-500 font-medium py-2 pr-4">Status</th>
                  <th className="text-left text-gray-500 font-medium py-2">Backup</th>
                </tr>
              </thead>
              <tbody>
                {vacations.filter(v => v.status !== 'denied').map(v => {
                  const c = collaborators.find(col => col.id === v.collaboratorId)
                  const backup = collaborators.find(col => col.id === v.backupId)
                  return (
                    <tr key={v.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-700">{c?.name}</td>
                      <td className="py-2 pr-4 text-gray-500">{formatDate(v.startDate)} → {formatDate(v.endDate)}</td>
                      <td className="py-2 pr-4"><VacationStatusBadge status={v.status} /></td>
                      <td className="py-2 text-gray-500">{backup?.name ?? '—'}</td>
                    </tr>
                  )
                })}
                {vacations.filter(v => v.status !== 'denied').length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400">Nenhuma férias registrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
