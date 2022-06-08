/* eslint-disable max-len */
const books = require('./books');
const {
  nanoid,
} = require('nanoid');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const dateNow = new Date().toISOString();

  const newBook = {
    'id': id,
    'name': name,
    'year': year,
    'author': author,
    'summary': summary,
    'publisher': publisher,
    'pageCount': pageCount,
    'readPage': readPage,
    'finished': pageCount === readPage ? true : false,
    'reading': reading,
    'insertedAt': dateNow,
    'updatedAt': dateNow,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      'status': 'success',
      'message': 'Buku berhasil ditambahkan',
      'data': {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    'status': 'error',
    'message': 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const bookByName = books.filter((book) => book.name.toLowerCase().search(name.toLowerCase()) >= 0);
    const response = h.response({
      'status': 'success',
      'data': {
        'books': bookByName.map((book, index) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }),
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    if (reading === '1') {
      const bookIsReading = books.filter((book) => book.reading === (reading === '1') ? true : false);
      const response = h.response({
        'status': 'success',
        'data': {
          'books': bookIsReading.map((book, index) => {
            return {
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            };
          }),
        },
      });
      response.code(200);
      return response;
    } else {
      const bookIsUnReading = books.filter((book) => book.reading === false);
      const response = h.response({
        'status': 'success',
        'data': {
          'books': bookIsUnReading.map((book, index) => {
            return {
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            };
          }),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (finished !== '' && finished !== undefined) {
    if (finished === '1') {
      const bookIsFinished = books.filter((book) => book.finished === true);
      const response = h.response({
        'status': 'success',
        'data': {
          'books': bookIsFinished.map((book, index) => {
            return {
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            };
          }),
        },
      });

      response.code(200);
      return response;
    } else {
      const bookIsUnFinished = books.filter((book) => book.finished === false);
      const response = h.response({
        'status': 'success',
        'data': {
          'books': bookIsUnFinished.map((book, index) => {
            return {
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            };
          }),
        },
      });

      response.code(200);
      return response;
    }
  }

  const response = h.response({
    'status': 'success',
    'data': {
      'books': books.map((book, index) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      }),
    },
  });
  response.code(200);
  return response;
};

const getSpesificBookHandler = (request, h) => {
  const {bookId} = request.params;
  const specificBook = books.filter((book) => book.id === bookId);

  if (specificBook.length === 0) {
    const response = h.response({
      'status': 'fail',
      'message': 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    'status': 'success',
    'data': {
      'book': specificBook[0],
    },
  });
  response.code(200);
  return response;
};

const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.findIndex((book) => book.id === bookId);

  if (book === -1) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === '' || name === undefined) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books[book] = {
    ...books[book],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  const response = h.response({
    'status': 'success',
    'message': 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};
const deleteBookHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.findIndex((book) => book.id === bookId);

  if (book === -1) {
    const response = h.response({
      'status': 'fail',
      'message': 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(book, 1);
  const response = h.response({
    'status': 'success',
    'message': 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getSpesificBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
