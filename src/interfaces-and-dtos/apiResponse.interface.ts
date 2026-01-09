// custom unified response type to return typed response body, headers and status code
export interface ApiResponse<T> {
    status: number;
    headers: Record<string, string>; //
    responseJson: T; // generic type to reuse with different data types
}
