import request from 'supertest';
import app from '../../src/app'; // ajuste o caminho conforme sua estrutura
import { Server } from 'http';

describe('CRUD de Tarefas - /api/tasks', () => {
    const agent = request(app as unknown as Server);
    const token = process.env.API_TOKEN; // se sua API usar auth, exporte API_TOKEN no env
    let createdTaskId: string | undefined;

    // helper para adicionar header de auth quando necessário
    function send(method: 'get' | 'post' | 'put' | 'delete', path: string) {
        const r = (agent as any)[method](path);
        if (token) r.set('Authorization', `Bearer ${token}`);
        return r;
    }

    it('POST /api/tasks - deve criar uma tarefa válida', async () => {
        const payload = {
            title: 'Teste de integração - tarefa',
            description: 'Descrição da tarefa',
        };

        const res = await send('post', '/api/tasks').send(payload);

        // aceita 200 ou 201 dependendo da implementação
        expect([200, 201]).toContain(res.status);
        expect(res.body).toBeDefined();
        expect(res.body.title).toBe(payload.title);
        expect(res.body.description).toBe(payload.description);
        // aceita id em id ou _id
        createdTaskId = res.body.id || res.body._id;
        expect(createdTaskId).toBeTruthy();
        // campo completed padrão
        if (res.body.completed !== undefined) {
            expect(typeof res.body.completed).toBe('boolean');
        }
    });

    it('GET /api/tasks - deve listar tarefas e conter a criada', async () => {
        const res = await send('get', '/api/tasks');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (createdTaskId) {
            const found = res.body.find((t: any) => t.id === createdTaskId || t._id === createdTaskId);
            expect(found).toBeDefined();
        }
    });

    it('GET /api/tasks/:id - deve retornar a tarefa criada', async () => {
        if (!createdTaskId) return fail('ID da tarefa criada não foi definido');

        const res = await send('get', `/api/tasks/${createdTaskId}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.id === createdTaskId || res.body._id === createdTaskId).toBe(true);
    });

    it('PUT /api/tasks/:id - deve atualizar a tarefa', async () => {
        if (!createdTaskId) return fail('ID da tarefa criada não foi definido');

        const updates = {
            title: 'Título atualizado - teste',
            completed: true,
        };

        const res = await send('put', `/api/tasks/${createdTaskId}`).send(updates);

        expect([200, 204]).toContain(res.status);
        // se retornar objeto atualizado, valida campos
        if (res.body && typeof res.body === 'object') {
            expect(res.body.title).toBe(updates.title);
            expect(res.body.completed).toBe(updates.completed);
        } else {
            // caso 204 No Content, faz GET para confirmar
            const getRes = await send('get', `/api/tasks/${createdTaskId}`);
            expect(getRes.status).toBe(200);
            expect(getRes.body.title).toBe(updates.title);
            expect(getRes.body.completed).toBe(updates.completed);
        }
    });

    it('DELETE /api/tasks/:id - deve remover a tarefa', async () => {
        if (!createdTaskId) return fail('ID da tarefa criada não foi definido');

        const res = await send('delete', `/api/tasks/${createdTaskId}`);

        expect([200, 204]).toContain(res.status);

        const getRes = await send('get', `/api/tasks/${createdTaskId}`);
        // espera 404 ou 400 ou 204 dependendo da implementação
        expect([404, 400, 204]).toContain(getRes.status);
    });

    it('POST /api/tasks - deve validar campos obrigatórios', async () => {
        const payload = { description: 'Sem título' }; // faltando title
        const res = await send('post', '/api/tasks').send(payload);

        // espera erro de validação (400) ou 422
        expect([400, 422]).toContain(res.status);
    });
});