import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Collaborator, Vacation } from '../types'

const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    name: 'Rafael Silva',
    role: 'Desenvolvedor Frontend',
    email: 'rafael.silva@sidi.org.br',
    github: '@rafaelhdev',
  },
  {
    id: '2',
    name: 'Rebeca Valgueiro',
    role: 'Desenvolvedora Frontend',
    email: 'rv.teixeira@sidi.org.br',
    github: '@rebecavalgueiro',
  },
]

const INITIAL_VACATIONS: Vacation[] = [
  {
    id: 'v1',
    collaboratorId: '2',
    startDate: '2026-02-10',
    endDate: '2026-02-21',
    status: 'approved',
    backupId: '1',
    fluigStatus: 'approved',
    fluigProtocol: 'FLG-2026-00142',
    createdAt: '2026-01-15',
  },
]

interface AppContextType {
  collaborators: Collaborator[]
  vacations: Vacation[]
  currentCollaboratorId: string
  addCollaborator: (c: Omit<Collaborator, 'id'>) => void
  addVacation: (v: Omit<Vacation, 'id' | 'createdAt'>) => void
  updateVacation: (id: string, patch: Partial<Vacation>) => void
  deleteCollaborator: (id: string) => void
  deleteVacation: (id: string) => void
  setCurrentCollaborator: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS)
  const [vacations, setVacations] = useState<Vacation[]>(INITIAL_VACATIONS)
  const [currentCollaboratorId, setCurrentCollaboratorId] = useState('1')

  function addCollaborator(c: Omit<Collaborator, 'id'>) {
    setCollaborators(prev => [...prev, { ...c, id: String(Date.now()) }])
  }

  function addVacation(v: Omit<Vacation, 'id' | 'createdAt'>) {
    setVacations(prev => [...prev, { ...v, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10) }])
  }

  function updateVacation(id: string, patch: Partial<Vacation>) {
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
