

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        tier: string;
    };
}
export interface TokenPayload {
    sub: string;    // User ID
    role: string;   // User role/tier
    type: 'access' | 'refresh';
}