import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Collaborator, Vacation } from '../types'
import { supabase } from '../lib/supabase'

interface AppContextType {
  collaborators: Collaborator[]
  vacations: Vacation[]
  currentCollaboratorId: string
  loading: boolean
  addCollaborator: (c: Omit<Collaborator, 'id'>) => Promise<void>
  addVacation: (v: Omit<Vacation, 'id' | 'createdAt'>) => Promise<void>
  updateVacation: (id: string, patch: Partial<Vacation>) => Promise<void>
  deleteCollaborator: (id: string) => void
  deleteVacation: (id: string) => void
  setCurrentCollaborator: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [vacations, setVacations] = useState<Vacation[]>([])
  const [currentCollaboratorId, setCurrentCollaboratorId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [{ data: collabs }, { data: vacs }] = await Promise.all([
        supabase.from('collaborators').select('*').order('name'),
        supabase.from('vacations').select('*').order('created_at', { ascending: false }),
      ])

      if (collabs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Collaborator[] = collabs.map((c: any) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          email: c.email,
          github: c.github,
          avatarUrl: c.avatar_url ?? undefined,
        }))
        setCollaborators(mapped)
        if (mapped.length > 0 && !currentCollaboratorId) {
          setCurrentCollaboratorId(mapped[0].id)
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
    } finally {
      setLoading(false)
    }
  }

  async function addCollaborator(c: Omit<Collaborator, 'id'>) {
    const { data, error } = await supabase.from('collaborators').insert({
      name: c.name,
      role: c.role,
      email: c.email,
      github: c.github,
      avatar_url: c.avatarUrl ?? null,
    }).select().single()

    if (error) throw error
    setCollaborators(prev => [...prev, { ...c, id: data.id }])
  }

  async function addVacation(v: Omit<Vacation, 'id' | 'createdAt'>) {
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
    setVacations(prev => [...prev, {
      ...v,
      id: data.id,
      createdAt: data.created_at,
    }])
  }

  async function updateVacation(id: string, patch: Partial<Vacation>) {
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

  function deleteCollaborator(id: string) {
    setCollaborators(prev => prev.filter(c => c.id !== id))
    setVacations(prev => prev.filter(v => v.collaboratorId !== id))
  }

  function deleteVacation(id: string) {
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
