declare function registerUser(req: any, res: any, next: any): Promise<void>;
declare function loginUser(req: any, res: any, next: any): Promise<void>;
declare function logoutUser(req: any, res: any, next: any): Promise<void>;
declare function refreshToken(req: any, res: any, next: any): Promise<void>;
declare function deleteUser(req: any, res: any, next: any): Promise<void>;
declare function getCurrentUser(req: any, res: any, next: any): Promise<void>;
declare function patchUser(req: any, res: any, next: any): Promise<void>;
declare function patchUserPassword(req: any, res: any, next: any): Promise<void>;
declare function patchUserEmail(req: any, res: any, next: any): Promise<void>;
declare const _default: {
    registerUser: typeof registerUser;
    deleteUser: typeof deleteUser;
    loginUser: typeof loginUser;
    logoutUser: typeof logoutUser;
    refreshToken: typeof refreshToken;
    getCurrentUser: typeof getCurrentUser;
    patchUser: typeof patchUser;
    patchUserPassword: typeof patchUserPassword;
    patchUserEmail: typeof patchUserEmail;
};
export default _default;
//# sourceMappingURL=authController.d.ts.map