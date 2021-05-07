export interface RefreshToken {
    id: number;
    isRevoked: boolean;
    expiresAt: Date;
}

export interface AccessToken {
    id: number;
    isRevoked: boolean;
    expiresAt: Date;
}