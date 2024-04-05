/**
 * Вариант ответа со списком
 */
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

/**
 * Основные операции
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * базовый универсальный класс Api работы с сервером
 */
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    /**
     * Констркутор Api
     * @param baseUrl - WWW-адрес базового сервиса
     * @param options - передаваемые опции
     */
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    /**
     * внутренняя функция обработки ответа сервера
     * @param response - ответ сервера
     * @returns Promise результата обработки
     */
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    /**
     * универсальный get
     * @param uri - относительный путь запроса
     * @returns Promise ответа сервера
     */
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    /**
     * универсальный post
     * @param uri - относительный путь запроса
     * @param data - передаваемые данные
     * @param method - метод (по умолчанию=POST)
     * @returns Promise ответа сервера
     */
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
