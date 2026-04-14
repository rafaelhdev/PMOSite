import type { VacationStatus, FluigStatus } from '../../types'

const VACATION_LABELS: Record<VacationStatus, string> = {
  intention: 'Intenção',
  approved: 'Aprovado',
  denied: 'Negado',
  confirmed: 'Confirmado',
}

const VACATION_COLORS: Record<VacationStatus, string> = {
  intention: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  confirmed: 'bg-blue-100 text-blue-800',
}

const FLUIG_LABELS: Record<FluigStatus, string> = {
  not_sent: 'Não enviado',
  pending: 'Aguardando Fluig',
  approved: 'Aprovado no Fluig',
  denied: 'Negado no Fluig',
}

const FLUIG_COLORS: Record<FluigStatus, string> = {
  not_sent: 'bg-gray-100 text-gray-600',
  pending: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export function VacationStatusBadge({ status }: { status: VacationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VACATION_COLORS[status]}`}>
      {VACATION_LABELS[status]}
    </span>
  )
}

export function FluigStatusBadge({ status }: { status: FluigStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${FLUIG_COLORS[status]}`}>
      {FLUIG_LABELS[status]}
    </span>
  )
}
