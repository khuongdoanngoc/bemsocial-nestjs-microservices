export const POST_PATTERNS = {
    // Post CRUD operations
    CREATE_POST: 'post.create',
    GET_POST: 'post.get',
    UPDATE_POST: 'post.update',
    DELETE_POST: 'post.delete',
    GET_ALL_POSTS: 'post.getAll',
    GET_USER_POSTS: 'post.getUserPosts',

    // Like operations
    LIKE_POST: 'post.like',
    UNLIKE_POST: 'post.unlike',
    GET_POST_LIKES: 'post.getLikes',

    // Comment patterns (handled by comment service but routed through post)
    CREATE_COMMENT: 'comment.create',
    GET_COMMENTS: 'comment.get',
    UPDATE_COMMENT: 'comment.update',
    DELETE_COMMENT: 'comment.delete',
} as const

export type PostPattern = typeof POST_PATTERNS[keyof typeof POST_PATTERNS]
