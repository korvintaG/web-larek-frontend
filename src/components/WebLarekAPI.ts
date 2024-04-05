import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderResult } from '../types/index';

/**
 * Интерфейс API сервиса Web-ларек
 */
export interface IWebLarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

/**
 * Класс API-сервиса Web-ларек
 */
export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	/**
	 * Конструктор класса API-сервиса Web-ларек
	 * @param cdn - пусть к картинкам
	 * @param baseUrl - базовый каталог
	 * @param options - дополнительные опции запросов
	 */
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Получить список товаров
	 * @returns список товаров
	 */
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	/**
	 * Получить подробную информацию о товаре
	 * @param id - ID товара
	 * @returns данные о товаре
	 */
	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	/**
	 * Сделать заказ
	 * @param order - данные заказа
	 * @returns результат обработки заказа
	 */
	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
