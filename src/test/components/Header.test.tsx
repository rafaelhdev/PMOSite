import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import Header from '../../components/layout/Header'
import { renderWithProviders } from '../utils/renderWithProviders'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

describe('Header', () => {
  it('exibe o logo PMO com link para o Dashboard', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('PMO')).toBeInTheDocument()
    // O link do logo deve apontar para /
    const logoLink = screen.getAllByRole('link', { name: /PMO/i })[0]
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('exibe os 4 links de navegação', () => {
    renderWithProviders(<Header />)
    expect(screen.getAllByRole('link', { name: 'Dashboard' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Calendário' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Colaboradores' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Férias' }).length).toBeGreaterThan(0)
  })

  it('exibe seletor de colaborador com colaboradores de fallback', () => {
    renderWithProviders(<Header />)
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThan(0)
    // Rafael Silva é o colaborador 1 (padrão)
    expect(selects[0]).toHaveValue('1')
  })

  it('botão de menu mobile abre o menu mobile', () => {
    renderWithProviders(<Header />)
    const menuBtn = screen.getByRole('button', { name: /menu/i })
    // Antes de abrir: só 1 "Logado como:" (desktop, que não tem CSS aplicado no jsdom)
    expect(screen.getAllByText('Logado como:').length).toBe(1)
    fireEvent.click(menuBtn)
    // Após abrir: 2 ocorrências (desktop + mobile)
    expect(screen.getAllByText('Logado como:').length).toBe(2)
  })

  it('links de navegação têm hrefs corretos', () => {
    renderWithProviders(<Header />)
    expect(screen.getAllByRole('link', { name: 'Dashboard' })[0]).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link', { name: 'Calendário' })[0]).toHaveAttribute('href', '/calendar')
    expect(screen.getAllByRole('link', { name: 'Colaboradores' })[0]).toHaveAttribute('href', '/collaborators')
    expect(screen.getAllByRole('link', { name: 'Férias' })[0]).toHaveAttribute('href', '/vacations')
  })
})
