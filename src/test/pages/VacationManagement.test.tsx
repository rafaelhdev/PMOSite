import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor, within, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../../context/AppContext'
import VacationManagement from '../../pages/VacationManagement'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {})
})

function renderVacation() {
  const result = render(
    <MemoryRouter>
      <AppProvider>
        <VacationManagement />
      </AppProvider>
    </MemoryRouter>
  )
  return result
}

function getDateInputs(container: HTMLElement) {
  return container.querySelectorAll<HTMLInputElement>('input[type="date"]')
}

describe('VacationManagement', () => {
  it('renderiza o título "Minhas Férias"', () => {
    renderVacation()
    expect(screen.getByText('Minhas Férias')).toBeInTheDocument()
  })

  it('exibe botão "+ Registrar Intenção"', () => {
    renderVacation()
    expect(screen.getByRole('button', { name: /registrar intenção/i })).toBeInTheDocument()
  })

  it('abre o formulário ao clicar em "+ Registrar Intenção"', async () => {
    const user = userEvent.setup()
    renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))
    expect(screen.getByText('Nova Intenção de Férias')).toBeInTheDocument()
  })

  it('formulário tem campos de data de início e fim', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))
    const dateInputs = getDateInputs(container)
    expect(dateInputs).toHaveLength(2)
    expect(dateInputs[0]).toHaveAttribute('type', 'date')
    expect(dateInputs[1]).toHaveAttribute('type', 'date')
  })

  it('exibe erro quando data de início é posterior à data de fim', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    const [startInput, endInput] = getDateInputs(container)
    fireEvent.change(startInput, { target: { value: '2026-08-20' } })
    fireEvent.change(endInput, { target: { value: '2026-08-10' } })

    await user.click(screen.getByRole('button', { name: 'Registrar Intenção' }))

    expect(screen.getByText(/data de início deve ser anterior/i)).toBeInTheDocument()
  })

  it('registra férias com datas válidas e sem conflito', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    const [startInput, endInput] = getDateInputs(container)
    fireEvent.change(startInput, { target: { value: '2026-09-01' } })
    fireEvent.change(endInput, { target: { value: '2026-09-15' } })

    await user.click(screen.getByRole('button', { name: 'Registrar Intenção' }))

    await waitFor(() => {
      expect(screen.queryByText('Nova Intenção de Férias')).not.toBeInTheDocument()
    })
  })

  it('exibe aviso de conflito quando há sobreposição com outro colaborador', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    // Datas que sobrepõem com férias de fallback de Rebeca (2026-02-10 a 2026-02-21)
    const [startInput, endInput] = getDateInputs(container)
    fireEvent.change(startInput, { target: { value: '2026-02-15' } })
    fireEvent.change(endInput, { target: { value: '2026-02-28' } })

    await user.click(screen.getByRole('button', { name: 'Registrar Intenção' }))

    await waitFor(() => {
      expect(screen.getByText(/conflito/i)).toBeInTheDocument()
    })
  })

  it('exibe botão "Confirmar mesmo assim" quando há conflito', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    const [startInput, endInput] = getDateInputs(container)
    fireEvent.change(startInput, { target: { value: '2026-02-15' } })
    fireEvent.change(endInput, { target: { value: '2026-02-28' } })
    await user.click(screen.getByRole('button', { name: 'Registrar Intenção' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /confirmar mesmo assim/i })).toBeInTheDocument()
    })
  })

  it('permite registrar mesmo com conflito ao clicar "Confirmar mesmo assim"', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    const [startInput, endInput] = getDateInputs(container)
    fireEvent.change(startInput, { target: { value: '2026-02-15' } })
    fireEvent.change(endInput, { target: { value: '2026-02-28' } })
    await user.click(screen.getByRole('button', { name: 'Registrar Intenção' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /confirmar mesmo assim/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /confirmar mesmo assim/i }))

    await waitFor(() => {
      expect(screen.queryByText('Nova Intenção de Férias')).not.toBeInTheDocument()
    })
  })

  it('exibe mensagem de lista vazia quando não há férias do colaborador atual', () => {
    renderVacation()
    expect(screen.getByText(/nenhuma férias registrada/i)).toBeInTheDocument()
  })

  it('exibe banner de backup quando o colaborador atual é backup de alguém', () => {
    // Colaborador '1' (Rafael) é backup da férias de Rebeca nos dados de fallback
    renderVacation()
    expect(screen.getByText(/você é backup de/i)).toBeInTheDocument()
    expect(screen.getByText('Rebeca Valgueiro')).toBeInTheDocument()
  })

  it('select de backup lista apenas outros colaboradores', async () => {
    const user = userEvent.setup()
    const { container } = renderVacation()
    await user.click(screen.getByRole('button', { name: /registrar intenção/i }))

    const selects = container.querySelectorAll('select')
    const backupSelect = selects[0]
    const options = within(backupSelect).getAllByRole('option')
    // "Selecione um backup" + Rebeca (não Rafael, que é o atual)
    expect(options).toHaveLength(2)
    expect(options[1]).toHaveTextContent('Rebeca Valgueiro')
  })
})
