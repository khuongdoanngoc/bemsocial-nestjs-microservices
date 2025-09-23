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
import { CommentService } from './comment.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import {
    CreateCommentRequestDto,
    CreateCommentDto,
    UpdateCommentRequestDto,
    UpdateCommentDto,
    GetCommentsDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // Create a new comment
    @Post()
    createComment(@Body(ValidationPipe) createCommentRequestDto: CreateCommentRequestDto, @Request() req: any) {
        const userId = req.user.id
        // Convert to CreateCommentDto for microservice communication
        const createCommentDto: CreateCommentDto = {
            ...createCommentRequestDto,
            userId
        }
        return this.commentService.createComment(createCommentDto)
    }

    // Get comments for a specific post
    @Get('post/:postId')
    getComments(@Param('postId') postId: string, @Query() query: GetCommentsDto) {
        const { page = 1, limit = 10 } = query
        return this.commentService.getComments({ 
            postId, 
            page: Number(page), 
            limit: Number(limit) 
        })
    }

    // Update comment
    @Put(':id')
    updateComment(
        @Param('id') id: string,
        @Body(ValidationPipe) updateCommentRequestDto: UpdateCommentRequestDto,
        @Request() req: any
    ) {
        const userId = req.user.id
        // Convert to UpdateCommentDto for microservice communication
        const updateCommentDto: UpdateCommentDto = {
            ...updateCommentRequestDto,
            id,
            userId
        }
        return this.commentService.updateComment(updateCommentDto)
    }

    // Delete comment
    @Delete(':id')
    deleteComment(@Param('id') id: string, @Request() req: any) {
        const userId = req.user.id
        return this.commentService.deleteComment({ id, userId })
    }
}
