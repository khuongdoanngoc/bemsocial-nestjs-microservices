import { Controller } from '@nestjs/common'
import { PostService } from './post.service'
import { RabbitRPC, RabbitMQPayload } from '../rabbitmq/rabbitmq.decorators'
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
} from '@app/contracts/dtos/post/post.request.dto'

@Controller()
export class PostController {
    constructor(private readonly postService: PostService) {}

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.CREATE_POST,
        queue: 'post.queue',
    })
    async createPost(@RabbitMQPayload() createPostDto: CreatePostDto) {
        return await this.postService.createPost(createPostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.GET_POST,
        queue: 'post.queue',
    })
    async getPost(@RabbitMQPayload() getPostDto: GetPostDto) {
        return await this.postService.getPost(getPostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.UPDATE_POST,
        queue: 'post.queue',
    })
    async updatePost(@RabbitMQPayload() updatePostDto: UpdatePostDto) {
        return await this.postService.updatePost(updatePostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.DELETE_POST,
        queue: 'post.queue',
    })
    async deletePost(@RabbitMQPayload() deletePostDto: DeletePostDto) {
        return await this.postService.deletePost(deletePostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.GET_ALL_POSTS,
        queue: 'post.queue',
    })
    async getAllPosts(@RabbitMQPayload() getAllPostsDto: GetAllPostsDto) {
        return await this.postService.getAllPosts(getAllPostsDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.GET_USER_POSTS,
        queue: 'post.queue',
    })
    async getUserPosts(@RabbitMQPayload() getUserPostsDto: GetUserPostsDto) {
        return await this.postService.getUserPosts(getUserPostsDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.LIKE_POST,
        queue: 'post.queue',
    })
    async likePost(@RabbitMQPayload() likePostDto: LikePostDto) {
        return await this.postService.likePost(likePostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.UNLIKE_POST,
        queue: 'post.queue',
    })
    async unlikePost(@RabbitMQPayload() unlikePostDto: UnlikePostDto) {
        return await this.postService.unlikePost(unlikePostDto)
    }

    @RabbitRPC({
        exchange: 'post.topic',
        routingKey: POST_PATTERNS.GET_POST_LIKES,
        queue: 'post.queue',
    })
    async getPostLikes(@RabbitMQPayload() getPostLikesDto: GetPostLikesDto) {
        return await this.postService.getPostLikes(getPostLikesDto)
    }
}
