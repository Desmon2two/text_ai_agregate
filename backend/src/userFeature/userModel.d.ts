declare function findByEmail(email: any): Promise<any>;
declare function findByUsername(username: any): Promise<any>;
declare function findById(userId: any): Promise<any>;
declare function deleteById(userId: any, context: any): Promise<any>;
declare function createUser(email: any, password: any, username: any): any;
declare function patchUser(userId: any, newData: any): any;
declare const _default: {
    findByEmail: typeof findByEmail;
    findByUsername: typeof findByUsername;
    findById: typeof findById;
    createUser: typeof createUser;
    deleteById: typeof deleteById;
    patchUser: typeof patchUser;
};
export default _default;
//# sourceMappingURL=userModel.d.ts.map