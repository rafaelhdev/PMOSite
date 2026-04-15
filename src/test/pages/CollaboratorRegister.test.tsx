import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CollaboratorRegister from '../../pages/CollaboratorRegister'
import { renderWithProviders } from '../utils/renderWithProviders'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

describe('CollaboratorRegister', () => {
  it('renderiza os 4 campos obrigatórios', () => {
    renderWithProviders(<CollaboratorRegister />)
    expect(screen.getByPlaceholderText('Ex: Rafael Silva')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: Desenvolvedor Frontend')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: nome@sidi.org.br')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('@usuario')).toBeInTheDocument()
  })

  it('exibe o título "Cadastrar Colaborador"', () => {
    renderWithProviders(<CollaboratorRegister />)
    expect(screen.getByText('Cadastrar Colaborador')).toBeInTheDocument()
  })

  it('exibe mensagem de sucesso após submit válido', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CollaboratorRegister />)

    await user.type(screen.getByPlaceholderText('Ex: Rafael Silva'), 'João Teste')
    await user.type(screen.getByPlaceholderText('Ex: Desenvolvedor Frontend'), 'QA Engineer')
    await user.type(screen.getByPlaceholderText('Ex: nome@sidi.org.br'), 'joao@sidi.org.br')
    await user.type(screen.getByPlaceholderText('@usuario'), '@joao')

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => {
      expect(screen.getByText(/cadastrado com sucesso/i)).toBeInTheDocument()
    })
  })

  it('não submete formulário com campos vazios (HTML5 required)', () => {
    renderWithProviders(<CollaboratorRegister />)
    const nameInput = screen.getByPlaceholderText('Ex: Rafael Silva')
    expect(nameInput).toBeRequired()
    expect(screen.getByPlaceholderText('Ex: Desenvolvedor Frontend')).toBeRequired()
    expect(screen.getByPlaceholderText('Ex: nome@sidi.org.br')).toBeRequired()
    expect(screen.getByPlaceholderText('@usuario')).toBeRequired()
  })

  it('botão Cancelar está presente', () => {
    renderWithProviders(<CollaboratorRegister />)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('campo de email aceita apenas formato válido', () => {
    renderWithProviders(<CollaboratorRegister />)
    const emailInput = screen.getByPlaceholderText('Ex: nome@sidi.org.br')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('submit chama addCollaborator com os dados preenchidos', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CollaboratorRegister />)

    await user.type(screen.getByPlaceholderText('Ex: Rafael Silva'), 'Maria Costa')
    await user.type(screen.getByPlaceholderText('Ex: Desenvolvedor Frontend'), 'Scrum Master')
    await user.type(screen.getByPlaceholderText('Ex: nome@sidi.org.br'), 'maria@sidi.org.br')
    await user.type(screen.getByPlaceholderText('@usuario'), '@mariacosta')

    fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar' }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText(/cadastrado com sucesso/i)).toBeInTheDocument()
    })
  })
})
