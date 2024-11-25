/**
 * This is a custom error type that is used to display errors to the user.
 * We can later check for this type of error and display a user friendly message to the user.
 * 
 * This can also prevent us from exposing internal error messages to the user,
 * and differentiates them from programming errors.
 */
class UserPresentableError extends Error {
    /**
     * Creates an instance of UserPresentableError.
     * @param message - The error message to display to the user.
     */
    constructor(message: string) {
        super(message);
        this.name = "UserPresentableError";
        Object.setPrototypeOf(this, UserPresentableError.prototype);
    }
}

export default UserPresentableError;
