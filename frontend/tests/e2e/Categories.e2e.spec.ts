import { test, expect} from '@playwright/test';

test('navega para Categorias e lista itens do backend', async ({ page }) => {
    await page.goto('/categories')
    await page.getByRole('link', { name: 'Categorias' }).click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
    await expect(page.getByText(/Study/i)).toBeVisible()
});

test('cria categoria e aparece na lista', async ({ page }) => {
    await page.goto('/categories')
    await page.getByRole('link', { name: 'Categorias' }).click()
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click()
    await page.getByLabel('Nome:').fill('Cheguei coroi23s')
    await page.getByLabel('Descrição:').fill('Realizar testes de softwares E2E')
    await page.getByRole('button', { name: /Criar/i }).click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

});
test('excluir categotoria e não aparecer mais na lista', async ({ page }) => {
    await page.goto('/categories')
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name : /excluir/i }).first().click(
        { force: true }
    )
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

});
test('editar categoria e atualizar na lista', async ({ page }) => {
    await page.goto('/categories')
    await page.getByRole('button', { name: /editar/i }).first().click()
    await page.getByLabel('Nome:').fill('Cheguei coroie')
    await page.getByLabel('Descrição:').fill('Cheguei?')
    await page.getByRole('button', { name: /Atualizar/i }).first().click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
});