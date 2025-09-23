import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import { POST_PATTERNS } from '@app/contracts/dtos/post/post.pattern'
import {
    CreatePostDto,
    UpdatePostDto,
    GetPostDto,
    DeletePostDto,
    GetUserPostsDto,
    GetAllPostsDto,
    LikePostDto,
    UnlikePostDto,
    GetPostLikesDto,
    CreateCommentDto,
    UpdateCommentDto,
    GetCommentsDto,
    DeleteCommentDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Injectable()
export class PostService {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async createPost(createPostDto: CreatePostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.CREATE_POST,
                payload: createPostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to create post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getPost(getPostDto: GetPostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.GET_POST,
                payload: getPostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to get post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async updatePost(updatePostDto: UpdatePostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.UPDATE_POST,
                payload: updatePostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to update post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async deletePost(deletePostDto: DeletePostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.DELETE_POST,
                payload: deletePostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to delete post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getAllPosts(getAllPostsDto: GetAllPostsDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.GET_ALL_POSTS,
                payload: getAllPostsDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to get posts',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getUserPosts(getUserPostsDto: GetUserPostsDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.GET_USER_POSTS,
                payload: getUserPostsDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to get user posts',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async likePost(likePostDto: LikePostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.LIKE_POST,
                payload: likePostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to like post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async unlikePost(unlikePostDto: UnlikePostDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.UNLIKE_POST,
                payload: unlikePostDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to unlike post',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async getPostLikes(getPostLikesDto: GetPostLikesDto) {
        try {
            return await this.rabbitMQService.request({
                exchange: 'post.topic',
                routingKey: POST_PATTERNS.GET_POST_LIKES,
                payload: getPostLikesDto,
            })
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Failed to get post likes',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    // Comment methods
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
