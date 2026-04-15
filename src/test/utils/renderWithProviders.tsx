import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../../context/AppContext'
import type { ReactNode } from 'react'

interface WrapperOptions extends RenderOptions {
  initialRoute?: string
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AppProvider>{children}</AppProvider>
    </MemoryRouter>
  )
}

export function renderWithProviders(ui: ReactNode, options: WrapperOptions = {}) {
  const { initialRoute: _initialRoute, ...rest } = options
  return render(ui, { wrapper: Wrapper, ...rest })
}
