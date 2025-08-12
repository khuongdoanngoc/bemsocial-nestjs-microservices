import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  private books: BookDto[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      rating: 4.3,
    },
  ];

  create(createBookDto: CreateBookDto) {
    const newBook = {
      id: this.books.length + 1,
      ...createBookDto,
    };
    this.books.push(newBook);
    return newBook;
  }

  findAll() {
    return this.books;
  }

  findOne(id: number) {
    return this.books.find((book) => book.id === id);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const index = this.books.findIndex((book) => book.id === id);
    this.books[index] = { ...this.books[index], ...updateBookDto };
    return this.books[index];
  }

  remove(id: number) {
    this.books = this.books.filter((book) => book.id !== id);
    return this.books;
  }
}
