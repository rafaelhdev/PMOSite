export type VacationStatus = 'intention' | 'approved' | 'denied' | 'confirmed'

export type FluigStatus = 'not_sent' | 'pending' | 'approved' | 'denied'

export interface Vacation {
  id: string
  collaboratorId: string
  startDate: string // ISO date YYYY-MM-DD
  endDate: string
  status: VacationStatus
  backupId?: string
  fluigStatus: FluigStatus
  fluigProtocol?: string
  createdAt: string
}

export interface Collaborator {
  id: string
  name: string
  role: string
  email: string
  github: string
  avatarUrl?: string
  isBackupFor?: string[] // vacation IDs
  /** true = gestor (pode aprovar férias, cadastrar/deletar colaboradores) */
  isManager?: boolean
  /** UUID do usuário no Supabase Auth (auth.users.id) */
  userId?: string
}
