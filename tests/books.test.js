const request = require('supertest');
const api = request('http://localhost:5000'); // Sesuaikan port

let createdBookId;

describe('BookController API - Full CRUD with Validations', () => {
  // CREATE (valid)
  it('POST /api/book - should create a new valid book', async () => {
    const res = await api.post('/api/book').send({
      title: 'Belajar API Testing',
      author: 'Ali',
      publicationYear: 2024,
      isbn: '978-3-16-148410-0'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Belajar API Testing');
    createdBookId = res.body.id;
  });

  // CREATE (invalid ISBN)
  it('POST /api/book - should return 400 for invalid ISBN', async () => {
    const res = await api.post('/api/book').send({
      title: 'Invalid ISBN Book',
      author: 'Anonymous',
      publicationYear: 2024,
      isbn: 'INVALID-ISBN'
    });

    expect(res.statusCode).toBe(400);
  });

  // READ ALL
  it('GET /api/book - should return list of books', async () => {
    const res = await api.get('/api/book');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // READ ONE
  it('GET /api/book/:id - should return book by id', async () => {
    const res = await api.get(`/api/book/${createdBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdBookId);
  });

  // UPDATE
  it('PUT /api/book/:id - should update book', async () => {
    const res = await api.put(`/api/book/${createdBookId}`).send({
      title: 'API Updated',
      author: 'Updated Author',
      publicationYear: 2025,
      isbn: '978-3-16-148410-0'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('API Updated');
  });

  // DELETE
  it('DELETE /api/book/:id - should delete book', async () => {
    const res = await api.delete(`/api/book/${createdBookId}`);
    expect(res.statusCode).toBe(204);
  });

  // READ AFTER DELETE
  it('GET /api/book/:id - should return 404 after deletion', async () => {
    const res = await api.get(`/api/book/${createdBookId}`);
    expect(res.statusCode).toBe(404);
  });

  // BAD REQUEST
  it('GET /api/book/0 - should return 400 for invalid ID', async () => {
    const res = await api.get('/api/book/0');
    expect(res.statusCode).toBe(400);
  });
});
