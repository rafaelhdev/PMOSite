import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { VacationStatusBadge } from '../components/ui/StatusBadge'
import type { Vacation } from '../types'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function parseDate(d: string) { return new Date(d + 'T00:00:00') }
function formatDate(d: string) { return parseDate(d).toLocaleDateString('pt-BR') }

function vacationsInMonth(vacations: Vacation[], year: number, month: number) {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return vacations.filter(v => {
    const s = parseDate(v.startDate)
    const e = parseDate(v.endDate)
    return s <= end && e >= start && v.status !== 'denied'
  })
}

export default function Calendar() {
  const { vacations, collaborators } = useApp()
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-primary-600">Calendário Anual</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">◀</button>
          <span className="text-lg font-semibold text-gray-700 w-16 text-center">{year}</span>
          <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">▶</button>
        </div>
      </div>

      {/* Annual grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {MONTHS.map((month, idx) => {
          const mvs = vacationsInMonth(vacations, year, idx)
          const isSelected = selectedMonth === idx
          return (
            <button
              key={idx}
              onClick={() => setSelectedMonth(isSelected ? null : idx)}
              className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <p className={`font-semibold text-sm mb-2 ${isSelected ? 'text-primary-600' : 'text-gray-700'}`}>{month}</p>
              {mvs.length === 0 ? (
                <p className="text-xs text-gray-400">Sem férias</p>
              ) : (
                <div className="space-y-1">
                  {mvs.slice(0, 3).map(v => {
                    const c = collaborators.find(col => col.id === v.collaboratorId)
                    return (
                      <div key={v.id} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{c?.name.split(' ')[0]}</span>
                      </div>
                    )
                  })}
                  {mvs.length > 3 && <p className="text-xs text-gray-400">+{mvs.length - 3} mais</p>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Month detail */}
      {selectedMonth !== null && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-600 mb-4">
            {MONTHS[selectedMonth]} {year}
          </h2>
          {(() => {
            const mvs = vacationsInMonth(vacations, year, selectedMonth)
            if (mvs.length === 0) return <p className="text-gray-400 text-sm">Nenhuma férias neste mês.</p>
            return (
              <div className="space-y-3">
                {mvs.map(v => {
                  const c = collaborators.find(col => col.id === v.collaboratorId)
                  const backup = collaborators.find(col => col.id === v.backupId)
                  return (
                    <div key={v.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0 flex-wrap">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{c?.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(v.startDate)} → {formatDate(v.endDate)}</p>
                        {backup && <p className="text-xs text-gray-400 mt-0.5">Backup: {backup.name}</p>}
                      </div>
                      <VacationStatusBadge status={v.status} />
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
