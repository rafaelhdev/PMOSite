import type { VacationStatus, FluigStatus } from '../../types'

const VACATION_LABELS: Record<VacationStatus, string> = {
  intention: 'Intenção',
  approved: 'Aprovado',
  denied: 'Negado',
  confirmed: 'Confirmado',
}

const VACATION_COLORS: Record<VacationStatus, string> = {
  intention: 'bg-warning-50 text-warning-700 border border-warning-500',
  approved:  'bg-success-50 text-success-700 border border-success-500',
  denied:    'bg-danger-50 text-danger-700 border border-danger-500',
  confirmed: 'bg-secondary-50 text-secondary-600 border border-secondary-300',
}

const FLUIG_LABELS: Record<FluigStatus, string> = {
  not_sent: 'Não enviado',
  pending:  'Aguardando Fluig',
  approved: 'Aprovado no Fluig',
  denied:   'Negado no Fluig',
}

const FLUIG_COLORS: Record<FluigStatus, string> = {
  not_sent: 'bg-neutral-100 text-neutral-500 border border-neutral-300',
  pending:  'bg-warning-50 text-warning-700 border border-warning-500',
  approved: 'bg-success-50 text-success-700 border border-success-500',
  denied:   'bg-danger-50 text-danger-700 border border-danger-500',
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
