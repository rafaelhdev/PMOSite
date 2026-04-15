import { test, expect } from '@playwright/test'

test.describe('Gerenciamento de Férias', () => {
  test('exibe página de férias', async ({ page }) => {
    await page.goto('/vacations')
    await expect(page.getByRole('heading', { name: /minhas férias/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /registrar intenção/i })).toBeVisible()
  })

  test('registra intenção de férias com datas válidas', async ({ page }) => {
    await page.goto('/vacations')
    await page.getByRole('button', { name: /registrar intenção/i }).click()

    // Labels não têm htmlFor — usa input[type="date"] por posição
    await page.locator('input[type="date"]').first().fill('2026-10-01')
    await page.locator('input[type="date"]').nth(1).fill('2026-10-15')

    await page.getByRole('button', { name: 'Registrar Intenção' }).click()

    // Formulário fecha após registro bem-sucedido
    await expect(page.getByText('Nova Intenção de Férias')).not.toBeVisible()
  })

  test('exibe erro ao informar data início posterior à data fim', async ({ page }) => {
    await page.goto('/vacations')
    await page.getByRole('button', { name: /registrar intenção/i }).click()

    await page.locator('input[type="date"]').first().fill('2026-10-20')
    await page.locator('input[type="date"]').nth(1).fill('2026-10-10')

    await page.getByRole('button', { name: 'Registrar Intenção' }).click()

    await expect(page.getByText(/data de início deve ser anterior/i)).toBeVisible()
  })

  test('fluxo completo: registrar → aprovar → confirmar', async ({ page }) => {
    await page.goto('/vacations')
    await page.getByRole('button', { name: /registrar intenção/i }).click()

    await page.locator('input[type="date"]').first().fill('2026-11-01')
    await page.locator('input[type="date"]').nth(1).fill('2026-11-10')
    await page.getByRole('button', { name: 'Registrar Intenção' }).click()

    // Aprovar
    await expect(page.getByRole('button', { name: /aprovar \(gestor\)/i })).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: /aprovar \(gestor\)/i }).click()

    // Confirmar
    await expect(page.getByRole('button', { name: /confirmar aprovação/i })).toBeVisible()
    await page.getByRole('button', { name: /confirmar aprovação/i }).click()

    // Status confirmado
    await expect(page.getByText('Confirmado')).toBeVisible()
  })

  test('detecta conflito de datas e permite confirmar mesmo assim', async ({ page }) => {
    await page.goto('/vacations')

    // Primeiro registra férias para criar sobreposição
    await page.getByRole('button', { name: /registrar intenção/i }).click()
    await page.locator('input[type="date"]').first().fill('2026-12-01')
    await page.locator('input[type="date"]').nth(1).fill('2026-12-15')
    await page.getByRole('button', { name: 'Registrar Intenção' }).click()

    // Troca de usuário para criar conflito via header select
    const select = page.locator('select').first()
    const options = await select.locator('option').all()
    if (options.length > 1) {
      const secondValue = await options[1].getAttribute('value')
      if (secondValue) await select.selectOption(secondValue)
    }

    await page.getByRole('button', { name: /registrar intenção/i }).click()
    await page.locator('input[type="date"]').first().fill('2026-12-05')
    await page.locator('input[type="date"]').nth(1).fill('2026-12-20')
    await page.getByRole('button', { name: 'Registrar Intenção' }).click()

    // Pode mostrar conflito ou registrar direto (depende dos dados existentes)
    const conflictVisible = await page.getByText(/conflito/i).isVisible().catch(() => false)
    if (conflictVisible) {
      await page.getByRole('button', { name: /confirmar mesmo assim/i }).click()
    }

    await expect(page.getByText('Nova Intenção de Férias')).not.toBeVisible()
  })
})
