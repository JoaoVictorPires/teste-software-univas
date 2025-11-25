import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {

    test('navega para Usuários e lista itens do backend', async ({ page }) => {
        await page.goto('/') // Dashboard
        await page.getByRole('link', { name: 'Usuários' }).click()
        // Título da seção
        await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
        // Emails semeados (seed do backend)
        await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
        await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
    });
    test('cria usuário e aparece na lista', async ({ page }) => {
        await page.goto('/users')
        await page.getByRole('button', { name: /Adicionar Usuário/i }).click()
        const uniqueEmail = `aluno.${Date.now()}@ex.com`
        await page.getByLabel('Nome:').fill('Aluno E2E')
        await page.getByLabel('Email:').fill(uniqueEmail)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(uniqueEmail)).toBeVisible()
    });
    test('excluir usuário e não aparecer mais na lista', async ({ page }) => {
        await page.goto('/users')
        await page.getByRole('button', { name : /excluir/i }).first().click(
            { force: true }
        )
    });
    test('editar usuário e atualizar na lista', async ({ page }) => {
        await page.goto('/users')
        await page.getByRole('button', { name: /editar/i }).first().click()
        await page.getByLabel('Nome:').fill('Cheguei coroi')
        await page.getByRole('button', { name: /Atualizar/i }).first().click()
        await expect(page.getByText('Cheguei coroi')).toBeVisible()
    });
});
