import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @MessagePattern('books.createBook')
  create(@Payload() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @MessagePattern('books.findAllBooks')
  findAll() {
    return this.booksService.findAll();
  }

  @MessagePattern('books.findOneBook')
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern('books.updateBook')
  update(@Payload() updateBookDto: UpdateBookDto) {
    return this.booksService.update(updateBookDto.id, updateBookDto);
  }

  @MessagePattern('books.removeBook')
  remove(@Payload() id: number) {
    return this.booksService.remove(id);
  }
}
