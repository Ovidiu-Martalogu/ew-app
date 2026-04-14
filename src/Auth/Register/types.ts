
export type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type User = {
    id?: number; // JSON server will generate id
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}