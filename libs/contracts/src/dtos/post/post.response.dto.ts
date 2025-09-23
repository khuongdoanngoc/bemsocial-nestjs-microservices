import { Expose, Type } from 'class-transformer'
import { Types } from 'mongoose'

export class PostResponseDto {
    @Expose()
    _id: Types.ObjectId

    @Expose()
    content: string

    @Expose()
    images?: string[]

    @Expose()
    userId: Types.ObjectId

    @Expose()
    likesCount: number

    @Expose()
    commentsCount: number

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    // Optional user details (populated)
    @Expose()
    user?: {
        _id: Types.ObjectId
        firstName: string
        lastName: string
        email: string
    }

    // Flag to indicate if current user liked this post
    @Expose()
    isLiked?: boolean
}

export class PostsResponseDto {
    @Expose()
    @Type(() => PostResponseDto)
    posts: PostResponseDto[]

    @Expose()
    total: number

    @Expose()
    page: number

    @Expose()
    limit: number

    @Expose()
    totalPages: number
}

export class CommentResponseDto {
    @Expose()
    _id: Types.ObjectId

    @Expose()
    content: string

    @Expose()
    postId: Types.ObjectId

    @Expose()
    userId: Types.ObjectId

    @Expose()
    parentId?: Types.ObjectId

    @Expose()
    repliesCount: number

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    // Optional user details (populated)
    @Expose()
    user?: {
        _id: Types.ObjectId
        firstName: string
        lastName: string
        email: string
    }

    // Nested replies if populated
    @Expose()
    @Type(() => CommentResponseDto)
    replies?: CommentResponseDto[]
}

export class CommentsResponseDto {
    @Expose()
    @Type(() => CommentResponseDto)
    comments: CommentResponseDto[]

    @Expose()
    total: number

    @Expose()
    page: number

    @Expose()
    limit: number

    @Expose()
    totalPages: number
}

export class LikeResponseDto {
    @Expose()
    _id: Types.ObjectId

    @Expose()
    userId: Types.ObjectId

    @Expose()
    postId: Types.ObjectId

    @Expose()
    createdAt: Date

    // Optional user details (populated)
    @Expose()
    user?: {
        _id: Types.ObjectId
        firstName: string
        lastName: string
        email: string
    }
}

export class LikesResponseDto {
    @Expose()
    @Type(() => LikeResponseDto)
    likes: LikeResponseDto[]

    @Expose()
    total: number

    @Expose()
    page: number

    @Expose()
    limit: number

    @Expose()
    totalPages: number
}
