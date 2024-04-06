import { Model } from './base/Model';
import { IAppState, Category, IOrder, IProduct, FormErrors } from '../types';


/**
 * Данные для события изменения каталога
 */
export type CatalogChangeEvent = {
	catalog: IProduct[];
};

/**
 * Класс состояния приложения
 */
export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	basket: string[] = [];
	preview: string | null;
	orderPart: 1 | 2 = 1;
	order: IOrder = {
		payment: null,
		address: '',
		total: 0,
		email: '',
		phone: '',
		items: [],
	};
	formErrors: FormErrors = {};

	/**
	 * Загрузить в каталог товары
	 * @param items - список товаров
	 */
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	/**
	 * выставить текущую карточку
	 * @param item - карточка
	 */
	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	/**
	 * Добавить товар в корзину
	 * @param itemID - ID товара
	 */
	addToBasket(itemID: string) {
		if (!this.basket.find((i) => i === itemID)) {
			this.basket.push(itemID);
		}
	}

	/**
	 * Удалить товар с карточки
	 * @param itemID - ID товара
	 */
	delFromBasket(itemID: string) {
		if (this.basket.find((i) => i === itemID)) {
			this.basket.splice(this.basket.indexOf(itemID), 1);
		}
	}

	/**
	 * Добавить карточку в корзину, если ее нет, или удалить, если есть
	 * @param itemID - ID карточки
	 */
	toggleBasket(itemID: string) {
		if (this.basket.find((i) => i === itemID))
			this.basket.splice(this.basket.indexOf(itemID), 1);
		else this.basket.push(itemID);
	}

	/**
	 * Есть ли товар в корзине?
	 * @param itemID - ID карточки
	 * @returns есть или нет?
	 */
	isInBasket(itemID: string): boolean {
		return this.basket.indexOf(itemID) >= 0;
	}

	/**
	 * Посчитать сумму цены товаров в корзине
	 * @returns сумма в синапсах
	 */
	getBasketTotal(): number {
		return this.basket.reduce(
			(acc, itemID) => acc + this.catalog.find((el) => el.id === itemID).price,
			0
		);
	}

	/**
	 * Очистить корзину
	 */
	clearBasket() {
		this.basket = [];
	}

	/**
	 * Сохранить конкретное поле заказа
	 * @param field - поле
	 * @param value - значение
	 */
	setOrderField<T extends keyof IOrder>(field: T, value: IOrder[T]) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	/**
	 * Проверить корректность заполнения заказа
	 * @returns корректно или нет?
	 */
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (this.orderPart === 1) {
			if (!this.order.address) {
				errors.address = 'Необходимо указать адрес';
			}
			if (!this.order.payment) {
				errors.payment = 'Необходимо указать метод оплаты';
			}
		} else {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
