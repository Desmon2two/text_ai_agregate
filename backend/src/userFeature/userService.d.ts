declare function findByEmail(email: any): Promise<any>;
declare function findById(userId: any): Promise<any>;
declare function findByUsername(username: any): Promise<any>;
declare function deleteById(userId: any, context: any): Promise<any>;
declare function createUser(email: any, password: any, username: any): Promise<any>;
declare function patchOne(userId: any, newData: any): Promise<any>;
declare const _default: {
    findByEmail: typeof findByEmail;
    findByUsername: typeof findByUsername;
    createUser: typeof createUser;
    findById: typeof findById;
    deleteById: typeof deleteById;
    patchOne: typeof patchOne;
};
export default _default;
//# sourceMappingURL=userService.d.ts.map