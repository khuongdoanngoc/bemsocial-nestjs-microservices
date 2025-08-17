import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { BooksService } from './books.service'

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @MessagePattern('books.findAll')
    async findAll() {
        return await this.booksService.findAll()
    }
}
