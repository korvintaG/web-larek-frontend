/**
 * Варианты категорий
 */
export type Category =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

/**
 * интерфейс товара
 */
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number;
}

/**
 * Тип метода оплаты
 */
export type PaymentType = 'online' | 'cash' | null;

/**
 * Интерфейс заказа
 */
export interface IOrder {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

/**
 * Тип ошибок формы ввода заказа
 */
export type FormErrors = Partial<Record<keyof IOrder, string>>;

/**
 * Интерфейс ответа сервера на заказ товаров
 */
export interface IOrderResult {
	id: string;
	total: number;
}

/**
 * Интерфейс состояния всего приложения
 */
export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}
