

export const errorResponse = (message: string | Record<string, string>, statusCode: number) => {
    return {
        status: 'error',
        message,
        statusCode
    };
};



