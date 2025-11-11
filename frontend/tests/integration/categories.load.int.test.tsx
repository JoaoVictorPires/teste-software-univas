import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories'
import { server, apiGet, json } from '../setup'
import { HttpResponse } from 'msw'

describe('Categories integration - sucesso e falha', () => {
    it('renderiza categorias retornadas pela API', async () => {
        server.use(
            apiGet('/categories', (_req) => 
                json({
                    data: [
                        { id: '1', name: 'Financeiro', description: 'Contas', createdAt: new Date().toISOString(), tasks: [] },
                        { id: '2', name: 'IT', description: 'Desenvolvimento', createdAt: new Date().toISOString(), tasks: [] },
                    ]
                })
            )
        )
        render(<Categories />)
        await waitFor(() => {
            expect(screen.getByText('Financeiro')).toBeInTheDocument()
            expect(screen.getByText('Contas')).toBeInTheDocument()
            expect(screen.getByText('IT')).toBeInTheDocument()
            expect(screen.getByText('Desenvolvimento')).toBeInTheDocument()
        })
    })
    it('mostra mensagem de erro quando categoria não existe', async () => {
        server.use(
            apiGet('/categories', () => HttpResponse.error())
        )
        render(<Categories />)
        await waitFor(() => {
            expect(
                screen.getByText(/Erro ao carregar categorias/i)
            ).toBeInTheDocument();
        })
    })
})