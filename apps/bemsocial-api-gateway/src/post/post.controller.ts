import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
    Query,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common'
import { PostService } from './post.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import {
    CreatePostRequestDto,
    CreatePostDto,
    UpdatePostRequestDto,
    UpdatePostDto,
    GetAllPostsDto,
    GetUserPostsDto,
    LikePostDto,
    UnlikePostDto,
    GetPostLikesDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) {}

    // Create a new post
    @Post()
    createPost(@Body(ValidationPipe) createPostRequestDto: CreatePostRequestDto, @Request() req: any) {
        const userId = req.user.id
        // Convert to CreatePostDto for microservice communication
        const createPostDto: CreatePostDto = {
            ...createPostRequestDto,
            userId: userId.toString(),
        }
        return this.postService.createPost(createPostDto)
    }

    // Get all posts with pagination
    @Get()
    getAllPosts(@Query() query: GetAllPostsDto) {
        const { page = 1, limit = 10 } = query
        return this.postService.getAllPosts({ page: Number(page), limit: Number(limit) })
    }

    // Get specific post by ID
    @Get(':id')
    getPost(@Param('id') id: string) {
        return this.postService.getPost({ id })
    }

    // Get posts by user ID
    @Get('user/:userId')
    getUserPosts(@Param('userId') userId: string, @Query() query: GetUserPostsDto) {
        const { page = 1, limit = 10 } = query
        return this.postService.getUserPosts({
            userId,
            page: Number(page),
            limit: Number(limit),
        })
    }

    // Update post
    @Put(':id')
    updatePost(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePostRequestDto: UpdatePostRequestDto,
        @Request() req: any,
    ) {
        const userId = req.user.id
        // Convert to UpdatePostDto for microservice communication
        const updatePostDto: UpdatePostDto = {
            ...updatePostRequestDto,
            id,
            userId,
        }
        return this.postService.updatePost(updatePostDto)
    }

    // Delete post
    @Delete(':id')
    deletePost(@Param('id') id: string, @Request() req: any) {
        const userId = req.user.id
        return this.postService.deletePost({ id, userId })
    }

    // Like a post
    @Post(':id/like')
    likePost(@Param('id') postId: string, @Request() req: any) {
        const userId = req.user.id
        return this.postService.likePost({ postId, userId })
    }

    // Unlike a post
    @Delete(':id/like')
    unlikePost(@Param('id') postId: string, @Request() req: any) {
        const userId = req.user.id
        return this.postService.unlikePost({ postId, userId })
    }

    // Get post likes
    @Get(':id/likes')
    getPostLikes(@Param('id') postId: string, @Query() query: GetPostLikesDto) {
        const { page = 1, limit = 10 } = query
        return this.postService.getPostLikes({
            postId,
            page: Number(page),
            limit: Number(limit),
        })
    }
}
