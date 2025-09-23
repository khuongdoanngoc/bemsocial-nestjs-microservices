/**
 * Utility functions for object manipulation
 * Alternative to class-transformer for simple use cases
 */

/**
 * Pick specific properties from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key]
        }
    })
    return result
}

/**
 * Omit specific properties from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
}

/**
 * Map user object to safe object (without sensitive fields like password)
 */
export function mapUserToSafeObject(user: any) {
    return {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

/**
 * Generic function to exclude sensitive fields
 */
export function excludeSensitiveFields<T>(obj: T, sensitiveFields: (keyof T)[]): Partial<T> {
    const result = { ...obj }
    sensitiveFields.forEach(field => delete result[field])
    return result
}

/**
 * Transform object using a mapping function
 */
export function transformObject<T, R>(obj: T, transformFn: (obj: T) => R): R {
    return transformFn(obj)
}
