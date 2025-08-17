import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class BooksService {
    constructor(@Inject('BOOKS_SERVICE') private booksClient: ClientProxy) {}

    findAll() {
        return this.booksClient.send('books.findAll', {})
    }
}
