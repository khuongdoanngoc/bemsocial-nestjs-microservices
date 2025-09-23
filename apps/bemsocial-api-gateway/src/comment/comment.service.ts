import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import { POST_PATTERNS } from '@app/contracts/dtos/post/post.pattern'
import {
    CreateCommentDto,
    UpdateCommentDto,
    GetCommentsDto,
    DeleteCommentDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Injectable()
export class CommentService {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async createComment(createCommentDto: CreateCommentDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.CREATE_COMMENT,
                payload: createCommentDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to create comment',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getComments(getCommentsDto: GetCommentsDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.GET_COMMENTS,
                payload: getCommentsDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to get comments',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async updateComment(updateCommentDto: UpdateCommentDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.UPDATE_COMMENT,
                payload: updateCommentDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to update comment',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async deleteComment(deleteCommentDto: DeleteCommentDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.DELETE_COMMENT,
                payload: deleteCommentDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to delete comment',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
