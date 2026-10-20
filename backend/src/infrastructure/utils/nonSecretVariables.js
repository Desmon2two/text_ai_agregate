const nonSecretVariables = {
    MAX_ATTEMPTS: 2,
    getMaxAttempts() {
        return this.MAX_ATTEMPTS;
    },
};
Object.defineProperty(nonSecretVariables, "MAX_ATTEMPTS", {
    value: "secret",
    writable: false,
    enumerable: false,
    configurable: false,
});
export default {
    nonSecretVariables,
};
