import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function CollaboratorList() {
  const { collaborators, vacations } = useApp()

  function getActiveVacation(id: string) {
    const today = new Date().toISOString().slice(0, 10)
    return vacations.find(v => v.collaboratorId === id && v.startDate <= today && v.endDate >= today && v.status !== 'denied')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-600">Colaboradores</h1>
        <Link
          to="/collaborators/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          + Novo Colaborador
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collaborators.map(c => {
          const active = getActiveVacation(c.id)
          return (
            <Link
              key={c.id}
              to={`/collaborators/${c.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {getInitials(c.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 truncate">{c.role}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">{c.email}</p>
              <p className="text-xs text-gray-400 mb-3">{c.github}</p>
              {active ? (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  De férias
                </span>
              ) : (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  Disponível
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
