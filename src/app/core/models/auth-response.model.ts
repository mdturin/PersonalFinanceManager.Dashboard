export interface AuthResponse{
    success: boolean;
    message: string;
    token: string;
    refreshToken: string;
    tokenExpiration: Date;
}