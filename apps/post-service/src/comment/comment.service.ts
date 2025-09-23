import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RpcException } from '@nestjs/microservices'
import { Comment } from './schemas/comment.schema'
import { Post } from '../post/schemas/post.schema'
import { UserClient } from '../post/user.client'
import {
    CreateCommentDto,
    UpdateCommentDto,
    GetCommentsDto,
    DeleteCommentDto,
} from '@app/contracts/dtos/post/post.request.dto'

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<Comment>,
        
        @InjectModel(Post.name)
        private postModel: Model<Post>,
        
        private userClient: UserClient,
    ) {}

    /**
     * Helper method to fetch and attach user info to comments
     */
    private async attachUserInfo(items: any[], userIdField: string = 'userId') {
        if (!items || items.length === 0) return items

        // Get unique user IDs
        const userIds = [...new Set(items.map(item => item[userIdField].toString()))]
        
        // Fetch users from user service
        let users: any[] = []
        if (userIds.length > 0) {
            try {
                users = await this.userClient.getUsersByIds(userIds)
            } catch (error) {
                console.error('Error fetching users:', error)
                // Return items with original userIds if user service fails
                return items
            }
        }

        const userMap = new Map(users.map((user: any) => [user._id.toString(), user]))

        // Attach user info to items
        return items.map(item => ({
            ...item,
            [userIdField]: userMap.get(item[userIdField].toString()) || { _id: item[userIdField] }
        }))
    }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        try {
            // Check if post exists
            const post = await this.postModel.findById(createCommentDto.postId)
            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // If it's a reply, check parent comment exists
            if (createCommentDto.parentId) {
                const parentComment = await this.commentModel.findById(createCommentDto.parentId)
                if (!parentComment || parentComment.postId.toString() !== createCommentDto.postId.toString()) {
                    throw new RpcException({
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Parent comment not found or not in the same post',
                    })
                }
            }

            // Create comment
            const comment = new this.commentModel({
                ...createCommentDto,
                repliesCount: 0,
            })
            await comment.save()

            // Increment counters
            await Promise.all([
                this.postModel.findByIdAndUpdate(
                    createCommentDto.postId,
                    { $inc: { commentsCount: 1 } }
                ),
                createCommentDto.parentId ? 
                    this.commentModel.findByIdAndUpdate(
                        createCommentDto.parentId,
                        { $inc: { repliesCount: 1 } }
                    ) : 
                    Promise.resolve()
            ])

            return comment
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error creating comment:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create comment',
            })
        }
    }

    async getComments(getCommentsDto: GetCommentsDto) {
        try {
            const { postId, page = 1, limit = 10 } = getCommentsDto
            const skip = (page - 1) * limit

            // Get top-level comments (no parentId)
            const [comments, total] = await Promise.all([
                this.commentModel
                    .find({ postId, parentId: null })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.commentModel.countDocuments({ postId, parentId: null })
            ])

            // Attach user info to comments
            const commentsWithUsers = await this.attachUserInfo(comments)

            return {
                comments: commentsWithUsers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch comments',
            })
        }
    }

    async updateComment(updateCommentDto: UpdateCommentDto): Promise<Comment> {
        try {
            const comment = await this.commentModel.findById(updateCommentDto.id)
            
            if (!comment) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Comment not found',
                })
            }

            // Check if user owns the comment
            if (comment.userId.toString() !== updateCommentDto.userId.toString()) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'You can only update your own comments',
                })
            }

            const updatedComment = await this.commentModel
                .findByIdAndUpdate(
                    updateCommentDto.id,
                    { 
                        content: updateCommentDto.content || comment.content,
                        updatedAt: new Date(),
                    },
                    { new: true }
                )
                .lean()

            if (!updatedComment) {
                throw new RpcException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update comment',
                })
            }

            // Attach user info
            const [commentWithUser] = await this.attachUserInfo([updatedComment])
            return commentWithUser
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error updating comment:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update comment',
            })
        }
    }

    async deleteComment(deleteCommentDto: DeleteCommentDto): Promise<{ success: boolean }> {
        try {
            const comment = await this.commentModel.findById(deleteCommentDto.id)
            
            if (!comment) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Comment not found',
                })
            }

            // Check if user owns the comment
            if (comment.userId.toString() !== deleteCommentDto.userId.toString()) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'You can only delete your own comments',
                })
            }

            // Delete comment and all its replies
            await Promise.all([
                this.commentModel.findByIdAndDelete(deleteCommentDto.id),
                this.commentModel.deleteMany({ parentId: deleteCommentDto.id }),
            ])

            // Decrement counters separately
            const counterUpdates: Promise<any>[] = []
            
            if (comment.parentId) {
                counterUpdates.push(
                    this.commentModel.findByIdAndUpdate(
                        comment.parentId,
                        { $inc: { repliesCount: -(comment.repliesCount + 1) } }
                    )
                )
            }

            counterUpdates.push(
                this.postModel.findByIdAndUpdate(
                    comment.postId,
                    { $inc: { commentsCount: -(comment.repliesCount + 1) } }
                )
            )

            if (counterUpdates.length > 0) {
                await Promise.all(counterUpdates)
            }

            return { success: true }
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error deleting comment:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to delete comment',
            })
        }
    }
}
