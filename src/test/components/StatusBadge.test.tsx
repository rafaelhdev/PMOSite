import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VacationStatusBadge, FluigStatusBadge } from '../../components/ui/StatusBadge'

describe('VacationStatusBadge', () => {
  it('exibe "Intenção" para status intention', () => {
    render(<VacationStatusBadge status="intention" />)
    expect(screen.getByText('Intenção')).toBeInTheDocument()
  })

  it('exibe "Aprovado" para status approved', () => {
    render(<VacationStatusBadge status="approved" />)
    expect(screen.getByText('Aprovado')).toBeInTheDocument()
  })

  it('exibe "Negado" para status denied', () => {
    render(<VacationStatusBadge status="denied" />)
    expect(screen.getByText('Negado')).toBeInTheDocument()
  })

  it('exibe "Confirmado" para status confirmed', () => {
    render(<VacationStatusBadge status="confirmed" />)
    expect(screen.getByText('Confirmado')).toBeInTheDocument()
  })

  it('aplica cor amarela para intention', () => {
    const { container } = render(<VacationStatusBadge status="intention" />)
    expect(container.firstChild).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('aplica cor verde para approved', () => {
    const { container } = render(<VacationStatusBadge status="approved" />)
    expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('aplica cor vermelha para denied', () => {
    const { container } = render(<VacationStatusBadge status="denied" />)
    expect(container.firstChild).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('aplica cor azul para confirmed', () => {
    const { container } = render(<VacationStatusBadge status="confirmed" />)
    expect(container.firstChild).toHaveClass('bg-blue-100', 'text-blue-800')
  })
})

describe('FluigStatusBadge', () => {
  it('exibe "Não enviado" para not_sent', () => {
    render(<FluigStatusBadge status="not_sent" />)
    expect(screen.getByText('Não enviado')).toBeInTheDocument()
  })

  it('exibe "Aguardando Fluig" para pending', () => {
    render(<FluigStatusBadge status="pending" />)
    expect(screen.getByText('Aguardando Fluig')).toBeInTheDocument()
  })

  it('exibe "Aprovado no Fluig" para approved', () => {
    render(<FluigStatusBadge status="approved" />)
    expect(screen.getByText('Aprovado no Fluig')).toBeInTheDocument()
  })

  it('exibe "Negado no Fluig" para denied', () => {
    render(<FluigStatusBadge status="denied" />)
    expect(screen.getByText('Negado no Fluig')).toBeInTheDocument()
  })

  it('aplica cor cinza para not_sent', () => {
    const { container } = render(<FluigStatusBadge status="not_sent" />)
    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-600')
  })

  it('aplica cor laranja para pending', () => {
    const { container } = render(<FluigStatusBadge status="pending" />)
    expect(container.firstChild).toHaveClass('bg-orange-100', 'text-orange-800')
  })
})
