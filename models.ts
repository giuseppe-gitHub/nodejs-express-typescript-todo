interface ITodoInput {
    title: string;
    description: string;
}

export interface IFailureResponse {
    success: string;
    message: string;
}

export function todoInputGuard(input: any): input is ITodoInput {
    return !!input.title && !!input.description;
}