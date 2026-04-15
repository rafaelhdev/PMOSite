import { test, expect } from '@playwright/test'

test.describe('Navegação', () => {
  test('página inicial carrega o Dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('navega para Calendário pelo Header', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a[href="/calendar"]').click()
    await expect(page).toHaveURL('/calendar')
    await expect(page.getByRole('heading', { name: /calendário/i })).toBeVisible()
  })

  test('navega para Colaboradores pelo Header', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a[href="/collaborators"]').click()
    await expect(page).toHaveURL('/collaborators')
    await expect(page.getByRole('heading', { name: /colaboradores/i })).toBeVisible()
  })

  test('navega para Férias pelo Header', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a[href="/vacations"]').click()
    await expect(page).toHaveURL('/vacations')
    await expect(page.getByRole('heading', { name: /minhas férias/i })).toBeVisible()
  })

  test('logo PMO navega para o Dashboard', async ({ page }) => {
    await page.goto('/calendar')
    await page.locator('a[href="/"]').first().click()
    await expect(page).toHaveURL('/')
  })
})
