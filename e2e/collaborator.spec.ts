import { test, expect } from '@playwright/test'

test.describe('Gerenciamento de Colaboradores', () => {
  test('exibe lista de colaboradores de fallback', async ({ page }) => {
    await page.goto('/collaborators')
    // Busca pelo card do colaborador (p.truncate), não pelo option do select
    await expect(page.locator('p.truncate', { hasText: 'Rafael Silva' })).toBeVisible()
    await expect(page.locator('p.truncate', { hasText: 'Rebeca Valgueiro' })).toBeVisible()
  })

  test('cria novo colaborador e exibe na lista', async ({ page }) => {
    await page.goto('/collaborators/new')

    await page.getByPlaceholder('Ex: Rafael Silva').fill('Ana Souza')
    await page.getByPlaceholder('Ex: Desenvolvedor Frontend').fill('Product Owner')
    await page.getByPlaceholder('Ex: nome@sidi.org.br').fill('ana@sidi.org.br')
    await page.getByPlaceholder('@usuario').fill('@anasouza')

    await page.getByRole('button', { name: 'Cadastrar' }).click()

    await expect(page.getByText(/cadastrado com sucesso/i)).toBeVisible()
    await page.waitForURL('/collaborators')
    await expect(page.locator('p.truncate', { hasText: 'Ana Souza' })).toBeVisible()
  })

  test('botão Cancelar retorna para lista de colaboradores', async ({ page }) => {
    await page.goto('/collaborators/new')
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page).toHaveURL('/collaborators')
  })

  test('acessa perfil do colaborador', async ({ page }) => {
    await page.goto('/collaborators')
    // Clica no card do colaborador (link), não no option do select
    await page.locator('a[href*="/collaborators/"]', { hasText: 'Rafael Silva' }).first().click()
    await expect(page).toHaveURL(/\/collaborators\//)
    await expect(page.locator('h1, h2', { hasText: 'Rafael Silva' })).toBeVisible()
  })
})
