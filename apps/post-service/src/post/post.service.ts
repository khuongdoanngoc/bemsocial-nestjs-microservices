import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RpcException } from '@nestjs/microservices'
import { Post } from './schemas/post.schema'
import { Like } from './schemas/like.schema'
import { Comment } from '../comment/schemas/comment.schema'
import { UserClient } from './user.client'
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

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name)
        private postModel: Model<Post>,
        
        @InjectModel(Like.name)
        private likeModel: Model<Like>,
        
        @InjectModel(Comment.name)
        private commentModel: Model<Comment>,
        
        private userClient: UserClient,
    ) {}

    /**
     * Helper method to fetch and attach user info to posts/likes
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

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        try {
            const post = new this.postModel({
                ...createPostDto,
                likesCount: 0,
                commentsCount: 0,
            })
            return await post.save()
        } catch (error) {
            console.error('Error creating post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create post',
            })
        }
    }

    async getPost(getPostDto: GetPostDto): Promise<Post> {
        try {
            const post = await this.postModel
                .findById(getPostDto.id)
                .lean()

            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // Attach user info
            const [postWithUser] = await this.attachUserInfo([post])
            return postWithUser
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error fetching post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch post',
            })
        }
    }

    async updatePost(updatePostDto: UpdatePostDto): Promise<Post> {
        try {
            const post = await this.postModel.findById(updatePostDto.id)
            
            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // Check if user owns the post
            if (post.userId.toString() !== updatePostDto.userId.toString()) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'You can only update your own posts',
                })
            }

            const updatedPost = await this.postModel
                .findByIdAndUpdate(
                    updatePostDto.id,
                    { 
                        content: updatePostDto.content || post.content,
                        images: updatePostDto.images || post.images,
                        updatedAt: new Date(),
                    },
                    { new: true }
                )
                .lean()

            if (!updatedPost) {
                throw new RpcException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update post',
                })
            }

            // Attach user info
            const [postWithUser] = await this.attachUserInfo([updatedPost])
            return postWithUser
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error updating post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update post',
            })
        }
    }

    async deletePost(deletePostDto: DeletePostDto): Promise<{ success: boolean }> {
        try {
            const post = await this.postModel.findById(deletePostDto.id)
            
            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // Check if user owns the post
            if (post.userId.toString() !== deletePostDto.userId.toString()) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'You can only delete your own posts',
                })
            }

            // Delete associated likes and comments
            await Promise.all([
                this.likeModel.deleteMany({ postId: deletePostDto.id }),
                this.commentModel.deleteMany({ postId: deletePostDto.id }),
                this.postModel.findByIdAndDelete(deletePostDto.id),
            ])

            return { success: true }
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error deleting post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to delete post',
            })
        }
    }

    async getAllPosts(getAllPostsDto: GetAllPostsDto) {
        try {
            const { page = 1, limit = 10 } = getAllPostsDto
            const skip = (page - 1) * limit

            
            const [posts, total] = await Promise.all([
                this.postModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.postModel.countDocuments()
            ])

            // Attach user info to posts
            const postsWithUsers = await this.attachUserInfo(posts)

            return {
                posts: postsWithUsers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.error('Error fetching all posts:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch posts',
            })
        }
    }

    async getUserPosts(getUserPostsDto: GetUserPostsDto) {
        try {
            const { userId, page = 1, limit = 10 } = getUserPostsDto
            const skip = (page - 1) * limit

            const [posts, total] = await Promise.all([
                this.postModel
                    .find({ userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.postModel.countDocuments({ userId })
            ])

            // Attach user info to posts
            const postsWithUsers = await this.attachUserInfo(posts)

            return {
                posts: postsWithUsers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.error('Error fetching user posts:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch user posts',
            })
        }
    }

    async likePost(likePostDto: LikePostDto): Promise<{ success: boolean; likesCount: number }> {
        try {
            // Check if post exists
            const post = await this.postModel.findById(likePostDto.postId)
            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // Check if user already liked the post
            const existingLike = await this.likeModel.findOne({
                postId: likePostDto.postId,
                userId: likePostDto.userId,
            })

            if (existingLike) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Post already liked',
                })
            }

            // Create like and increment likes count
            await Promise.all([
                new this.likeModel({
                    postId: likePostDto.postId,
                    userId: likePostDto.userId,
                }).save(),
                this.postModel.findByIdAndUpdate(
                    likePostDto.postId,
                    { $inc: { likesCount: 1 } }
                ),
            ])

            const updatedPost = await this.postModel.findById(likePostDto.postId)
            if (!updatedPost) {
                throw new RpcException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Post not found after like operation',
                })
            }
            return { success: true, likesCount: updatedPost.likesCount }
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error liking post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to like post',
            })
        }
    }

    async unlikePost(unlikePostDto: UnlikePostDto): Promise<{ success: boolean; likesCount: number }> {
        try {
            // Check if post exists
            const post = await this.postModel.findById(unlikePostDto.postId)
            if (!post) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Post not found',
                })
            }

            // Check if user liked the post
            const existingLike = await this.likeModel.findOne({
                postId: unlikePostDto.postId,
                userId: unlikePostDto.userId,
            })

            if (!existingLike) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Post not liked yet',
                })
            }

            // Remove like and decrement likes count
            await Promise.all([
                this.likeModel.findByIdAndDelete(existingLike._id),
                this.postModel.findByIdAndUpdate(
                    unlikePostDto.postId,
                    { $inc: { likesCount: -1 } }
                ),
            ])

            const updatedPost = await this.postModel.findById(unlikePostDto.postId)
            if (!updatedPost) {
                throw new RpcException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Post not found after unlike operation',
                })
            }
            return { success: true, likesCount: updatedPost.likesCount }
        } catch (error) {
            if (error instanceof RpcException) throw error
            console.error('Error unliking post:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to unlike post',
            })
        }
    }

    async getPostLikes(getPostLikesDto: GetPostLikesDto) {
        try {
            const { postId, page = 1, limit = 10 } = getPostLikesDto
            const skip = (page - 1) * limit

            const [likes, total] = await Promise.all([
                this.likeModel
                    .find({ postId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.likeModel.countDocuments({ postId })
            ])

            // Attach user info to likes
            const likesWithUsers = await this.attachUserInfo(likes)

            return {
                likes: likesWithUsers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.error('Error fetching post likes:', error)
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch post likes',
            })
        }
    }
}
