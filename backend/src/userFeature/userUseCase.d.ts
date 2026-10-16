declare function registerUser(email: any, password: any, username: any): Promise<{
    user: {
        id: any;
        email: any;
        username: any;
    };
    accessToken: any;
}>;
declare function loginUser(email: any, password: any): Promise<{
    user: {
        id: any;
        email: any;
        username: any;
        displayName: any;
        profilePic: any;
        bio: any;
    };
    accessToken: any;
    refreshToken: any;
}>;
declare function getCurrentUser(userId: any): Promise<{
    user: {
        id: any;
        email: any;
        profilePic: any;
        username: any;
        displayName: any;
        bio: any;
    };
}>;
declare function patchUserPassword(userId: any, currentPassword: any, newPassword: any): Promise<void>;
declare function patchUserEmail(userId: any, password: any, email: any): Promise<void>;
declare function patchUser(userId: any, userData: any): Promise<{
    user: {
        username: any;
        displayName: any;
        profilePic: any;
        bio: any;
    };
}>;
declare function refreshToken(token: any): Promise<{
    accessToken: any;
}>;
declare function deleteUser(userId: any): Promise<any>;
declare const _default: {
    registerUser: typeof registerUser;
    deleteUser: typeof deleteUser;
    loginUser: typeof loginUser;
    refreshToken: typeof refreshToken;
    getCurrentUser: typeof getCurrentUser;
    patchUser: typeof patchUser;
    patchUserPassword: typeof patchUserPassword;
    patchUserEmail: typeof patchUserEmail;
};
export default _default;
//# sourceMappingURL=userUseCase.d.ts.map