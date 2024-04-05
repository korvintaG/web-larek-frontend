import { Form } from './common/Form';
import { IOrder } from '../types';

/**
 * Класс для второй части оформления заказа
 */
export class OrderContacts extends Form<IOrder> {
	/**
	 * Сеттер для телефона
	 */
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	/**
	 * Сеттер для email
	 */
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
