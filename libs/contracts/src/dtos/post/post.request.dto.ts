import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsArray, IsUrl } from 'class-validator'
import { Types } from 'mongoose'

// DTO for API endpoint (client request) - no userId needed
export class CreatePostRequestDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsArray()
    @IsOptional()
    images?: string[]
}

// DTO for internal microservice communication - includes userId
export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsArray()
    @IsOptional()
    images?: string[]

    @IsString()
    @IsNotEmpty()
    userId: string
}

// DTO for API endpoint (client request) - no userId needed
export class UpdatePostRequestDto {
    @IsString()
    @IsOptional()
    content?: string

    @IsArray()
    @IsOptional()
    images?: string[]
}

// DTO for internal microservice communication - includes userId
export class UpdatePostDto {
    @IsMongoId()
    id: string | Types.ObjectId

    @IsString()
    @IsOptional()
    content?: string

    @IsArray()
    @IsOptional()
    images?: string[]

    @IsMongoId()
    userId: string | Types.ObjectId
}

export class GetPostDto {
    @IsMongoId()
    id: string | Types.ObjectId
}

export class DeletePostDto {
    @IsMongoId()
    id: string | Types.ObjectId

    @IsMongoId()
    userId: string | Types.ObjectId
}

export class GetUserPostsDto {
    @IsMongoId()
    userId: string | Types.ObjectId

    @IsOptional()
    page?: number = 1

    @IsOptional()
    limit?: number = 10
}

export class GetAllPostsDto {
    @IsOptional()
    page?: number = 1

    @IsOptional()
    limit?: number = 10
}

export class LikePostDto {
    @IsMongoId()
    postId: string | Types.ObjectId

    @IsMongoId()
    userId: string | Types.ObjectId
}

export class UnlikePostDto {
    @IsMongoId()
    postId: string | Types.ObjectId

    @IsMongoId()
    userId: string | Types.ObjectId
}

export class GetPostLikesDto {
    @IsMongoId()
    postId: string | Types.ObjectId

    @IsOptional()
    page?: number = 1

    @IsOptional()
    limit?: number = 10
}

// Comment DTOs for API endpoints (client requests) - no userId needed
export class CreateCommentRequestDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsMongoId()
    postId: string | Types.ObjectId

    @IsMongoId()
    @IsOptional()
    parentId?: string | Types.ObjectId // For replies
}

// Comment DTOs for internal microservice communication - includes userId
export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsMongoId()
    postId: string | Types.ObjectId

    @IsMongoId()
    userId: string | Types.ObjectId

    @IsMongoId()
    @IsOptional()
    parentId?: string | Types.ObjectId // For replies
}

// DTO for API endpoint (client request) - no userId needed
export class UpdateCommentRequestDto {
    @IsString()
    @IsOptional()
    content?: string
}

// DTO for internal microservice communication - includes userId
export class UpdateCommentDto {
    @IsMongoId()
    id: string | Types.ObjectId

    @IsString()
    @IsOptional()
    content?: string

    @IsMongoId()
    userId: string | Types.ObjectId
}

export class GetCommentsDto {
    @IsMongoId()
    postId: string | Types.ObjectId

    @IsOptional()
    page?: number = 1

    @IsOptional()
    limit?: number = 10
}

export class DeleteCommentDto {
    @IsMongoId()
    id: string | Types.ObjectId

    @IsMongoId()
    userId: string | Types.ObjectId
}
