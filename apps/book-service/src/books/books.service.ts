import { Injectable } from '@nestjs/common'

@Injectable()
export class BooksService {
    async findAll() {
        return [
            { id: 1, title: 'Book One', author: 'Author A' },
            { id: 2, title: 'Book Two', author: 'Author B' },
            { id: 3, title: 'Book Three', author: 'Author C' },
        ]
    }
}
