import { Controller } from '@nestjs/common'
import { CommentService } from './comment.service'
import { RabbitRPC, RabbitMQPayload } from '../rabbitmq/rabbitmq.decorators'
import { POST_PATTERNS } from '@app/contracts/dtos/post/post.pattern'
import {
    CreateCommentDto,
    UpdateCommentDto,
    GetCommentsDto,
    DeleteCommentDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.CREATE_COMMENT,
        queue: 'comment.queue',
    })
    async createComment(@RabbitMQPayload() createCommentDto: CreateCommentDto) {
        return await this.commentService.createComment(createCommentDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.GET_COMMENTS,
        queue: 'comment.queue',
    })
    async getComments(@RabbitMQPayload() getCommentsDto: GetCommentsDto) {
        return await this.commentService.getComments(getCommentsDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.UPDATE_COMMENT,
        queue: 'comment.queue',
    })
    async updateComment(@RabbitMQPayload() updateCommentDto: UpdateCommentDto) {
        return await this.commentService.updateComment(updateCommentDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.DELETE_COMMENT,
        queue: 'comment.queue',
    })
    async deleteComment(@RabbitMQPayload() deleteCommentDto: DeleteCommentDto) {
        return await this.commentService.deleteComment(deleteCommentDto)
    }
}
