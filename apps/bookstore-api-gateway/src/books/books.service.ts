import { Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOKS_SERVICE') private booksClient: ClientProxy) {}

  create(createBookDto: CreateBookDto) {
    return this.booksClient.send('books.createBook', createBookDto);
  }

  findAll() {
    return this.booksClient.send('books.findAllBooks', {});
  }

  findOne(id: number) {
    return this.booksClient.send('books.findOneBook', { id });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksClient.send('books.updateBook', { id, updateBookDto });
  }

  remove(id: number) {
    return this.booksClient.send('books.removeBook', { id });
  }
}
