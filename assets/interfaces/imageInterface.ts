export interface IModifiers {
    width?: number;
    height?: number;
    format?: string;
    fit?: string;
    [key: string]: any;  // For providerModifiers and other possible modifiers
}

export interface IOptions {
    modifiers?: IModifiers;
    baseURL?: string;
}

export interface IContext {
    options?: Record<string, unknown>;
    nuxtContext?: Record<string, unknown>;
    $img?: any;  // Assuming you'll replace 'any' with the actual type when you know it
}

export interface IUrl {
    url: string;
}
