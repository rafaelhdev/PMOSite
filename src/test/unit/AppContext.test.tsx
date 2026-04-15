import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AppProvider, useApp } from '../../context/AppContext'
import type { ReactNode } from 'react'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('AppContext — fallback data (sem Supabase)', () => {
  it('inicializa com os 2 colaboradores de fallback', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    expect(result.current.collaborators).toHaveLength(2)
    expect(result.current.collaborators[0].name).toBe('Rafael Silva')
    expect(result.current.collaborators[1].name).toBe('Rebeca Valgueiro')
  })

  it('inicializa com 1 férias de fallback', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    expect(result.current.vacations).toHaveLength(1)
    expect(result.current.vacations[0].status).toBe('approved')
  })

  it('currentCollaboratorId começa em "1"', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    expect(result.current.currentCollaboratorId).toBe('1')
  })

  it('loading começa false quando Supabase não está configurado', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    expect(result.current.loading).toBe(false)
  })

  it('addCollaborator adiciona novo colaborador ao estado', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {
      await result.current.addCollaborator({
        name: 'Novo Dev', role: 'Backend', email: 'novo@sidi.org.br', github: '@novodev',
      })
    })
    expect(result.current.collaborators).toHaveLength(3)
    expect(result.current.collaborators[2].name).toBe('Novo Dev')
  })

  it('addVacation adiciona nova férias ao estado', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {
      await result.current.addVacation({
        collaboratorId: '1',
        startDate: '2026-07-01',
        endDate: '2026-07-15',
        status: 'intention',
        fluigStatus: 'not_sent',
      })
    })
    expect(result.current.vacations).toHaveLength(2)
    expect(result.current.vacations[1].startDate).toBe('2026-07-01')
    expect(result.current.vacations[1].status).toBe('intention')
  })

  it('updateVacation atualiza o status da férias corretamente', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const vacationId = result.current.vacations[0].id

    await act(async () => {
      await result.current.updateVacation(vacationId, { status: 'confirmed' })
    })

    const updated = result.current.vacations.find(v => v.id === vacationId)
    expect(updated?.status).toBe('confirmed')
  })

  it('deleteVacation remove férias pelo id', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    const vacationId = result.current.vacations[0].id

    act(() => {
      result.current.deleteVacation(vacationId)
    })

    expect(result.current.vacations).toHaveLength(0)
  })

  it('deleteCollaborator remove colaborador e suas férias (cascade)', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})
    // colaborador '2' tem as férias de fallback
    act(() => {
      result.current.deleteCollaborator('2')
    })

    expect(result.current.collaborators).toHaveLength(1)
    expect(result.current.vacations).toHaveLength(0)
  })

  it('deleteCollaborator não remove férias de outros colaboradores', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})

    await act(async () => {
      await result.current.addVacation({
        collaboratorId: '1',
        startDate: '2026-08-01',
        endDate: '2026-08-10',
        status: 'intention',
        fluigStatus: 'not_sent',
      })
    })

    act(() => {
      result.current.deleteCollaborator('2')
    })

    expect(result.current.vacations).toHaveLength(1)
    expect(result.current.vacations[0].collaboratorId).toBe('1')
  })

  it('setCurrentCollaborator troca o colaborador ativo', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    await act(async () => {})

    act(() => {
      result.current.setCurrentCollaborator('2')
    })

    expect(result.current.currentCollaboratorId).toBe('2')
  })

  it('useApp lança erro fora do AppProvider', () => {
    expect(() => renderHook(() => useApp())).toThrow('useApp must be used inside AppProvider')
  })
})
