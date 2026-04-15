import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Collaborator, Vacation } from '../types'
import { supabase } from '../lib/supabase'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Dados de fallback para desenvolvimento sem Supabase ─────────────────────
const FALLBACK_COLLABORATORS: Collaborator[] = [
  {
    id: '1', name: 'Rafael Silva', role: 'Desenvolvedor Frontend',
    email: 'rafael.silva@sidi.org.br', github: '@rafaelhdev', isManager: false,
  },
  {
    id: '2', name: 'Rebeca Valgueiro', role: 'Desenvolvedora Frontend',
    email: 'rv.teixeira@sidi.org.br', github: '@rebecavalgueiro', isManager: false,
  },
  {
    id: '3', name: 'Gestor PMO', role: 'Gerente de Projetos',
    email: 'gestor.pmo@sidi.org.br', github: '@gestorpmo', isManager: true,
  },
]

const FALLBACK_VACATIONS: Vacation[] = [
  {
    id: 'v1', collaboratorId: '2', startDate: '2026-02-10', endDate: '2026-02-21',
    status: 'approved', backupId: '1', fluigStatus: 'approved',
    fluigProtocol: 'FLG-2026-00142', createdAt: '2026-01-15',
  },
]
// ────────────────────────────────────────────────────────────────────────────

interface AppContextType {
  collaborators: Collaborator[]
  vacations: Vacation[]
  currentCollaboratorId: string
  loading: boolean
  addCollaborator: (c: Omit<Collaborator, 'id'>) => Promise<void>
  addVacation: (v: Omit<Vacation, 'id' | 'createdAt'>) => Promise<void>
  updateVacation: (id: string, patch: Partial<Vacation>) => Promise<void>
  deleteCollaborator: (id: string) => Promise<void>
  deleteVacation: (id: string) => Promise<void>
  setCurrentCollaborator: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    SUPABASE_CONFIGURED ? [] : FALLBACK_COLLABORATORS
  )
  const [vacations, setVacations] = useState<Vacation[]>(
    SUPABASE_CONFIGURED ? [] : FALLBACK_VACATIONS
  )
  const [currentCollaboratorId, setCurrentCollaboratorId] = useState(
    SUPABASE_CONFIGURED ? '' : '1'
  )
  const [loading, setLoading] = useState(SUPABASE_CONFIGURED)

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [{ data: collabs, error: collabError }, { data: vacs, error: vacError }] =
        await Promise.all([
          supabase.from('collaborators').select('*').order('name'),
          supabase.from('vacations').select('*').order('created_at', { ascending: false }),
        ])

      if (collabError) throw collabError
      if (vacError) throw vacError

      if (collabs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Collaborator[] = collabs.map((c: any) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          email: c.email,
          github: c.github,
          avatarUrl: c.avatar_url ?? undefined,
          isManager: c.is_manager ?? false,
          userId: c.user_id ?? undefined,
        }))
        setCollaborators(mapped)

        // Determina o colaborador atual pelo usuário autenticado no Supabase
        if (!currentCollaboratorId) {
          const { data: { user } } = await supabase.auth.getUser()
          const mine = mapped.find(c => c.userId === user?.id)
          setCurrentCollaboratorId(mine?.id ?? (mapped[0]?.id ?? ''))
        }
      }

      if (vacs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Vacation[] = vacs.map((v: any) => ({
          id: v.id,
          collaboratorId: v.collaborator_id,
          startDate: v.start_date,
          endDate: v.end_date,
          status: v.status,
          backupId: v.backup_id ?? undefined,
          fluigStatus: v.fluig_status,
          fluigProtocol: v.fluig_protocol ?? undefined,
          createdAt: v.created_at,
        }))
        setVacations(mapped)
      }
    } catch (err) {
      console.error('[AppContext] fetchData error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addCollaborator(c: Omit<Collaborator, 'id'>) {
    if (!SUPABASE_CONFIGURED) {
      setCollaborators(prev => [...prev, { ...c, id: String(Date.now()) }])
      return
    }
    const { data, error } = await supabase.from('collaborators').insert({
      name: c.name,
      role: c.role,
      email: c.email,
      github: c.github,
      avatar_url: c.avatarUrl ?? null,
      is_manager: c.isManager ?? false,
    }).select().single()
    if (error) throw error
    setCollaborators(prev => [...prev, { ...c, id: data.id }])
  }

  async function addVacation(v: Omit<Vacation, 'id' | 'createdAt'>) {
    if (!SUPABASE_CONFIGURED) {
      setVacations(prev => [
        ...prev,
        { ...v, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10) },
      ])
      return
    }
    const { data, error } = await supabase.from('vacations').insert({
      collaborator_id: v.collaboratorId,
      start_date: v.startDate,
      end_date: v.endDate,
      status: v.status,
      backup_id: v.backupId ?? null,
      fluig_status: v.fluigStatus,
      fluig_protocol: v.fluigProtocol ?? null,
    }).select().single()
    if (error) throw error
    setVacations(prev => [...prev, { ...v, id: data.id, createdAt: data.created_at }])
  }

  async function updateVacation(id: string, patch: Partial<Vacation>) {
    if (!SUPABASE_CONFIGURED) {
      setVacations(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v))
      return
    }
    // Persiste no banco PRIMEIRO — só atualiza estado local se não houver erro
    const dbPatch: Record<string, unknown> = {}
    if (patch.status !== undefined) dbPatch.status = patch.status
    if (patch.backupId !== undefined) dbPatch.backup_id = patch.backupId
    if (patch.fluigStatus !== undefined) dbPatch.fluig_status = patch.fluigStatus
    if (patch.fluigProtocol !== undefined) dbPatch.fluig_protocol = patch.fluigProtocol
    if (patch.startDate !== undefined) dbPatch.start_date = patch.startDate
    if (patch.endDate !== undefined) dbPatch.end_date = patch.endDate

    const { error } = await supabase.from('vacations').update(dbPatch).eq('id', id)
    if (error) throw error
    setVacations(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v))
  }

  // #54 fix: persiste deleção no Supabase antes de atualizar estado local
  async function deleteCollaborator(id: string) {
    if (SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('collaborators').delete().eq('id', id)
      if (error) throw error
    }
    // ON DELETE CASCADE no banco remove as férias do colaborador automaticamente
    setCollaborators(prev => prev.filter(c => c.id !== id))
    setVacations(prev => prev.filter(v => v.collaboratorId !== id))
  }

  // #54 fix: persiste deleção no Supabase antes de atualizar estado local
  async function deleteVacation(id: string) {
    if (SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('vacations').delete().eq('id', id)
      if (error) throw error
    }
    setVacations(prev => prev.filter(v => v.id !== id))
  }

  return (
    <AppContext.Provider value={{
      collaborators,
      vacations,
      currentCollaboratorId,
      loading,
      addCollaborator,
      addVacation,
      updateVacation,
      deleteCollaborator,
      deleteVacation,
      setCurrentCollaborator: setCurrentCollaboratorId,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
