import { Form } from './common/Form';
import { IOrder, PaymentType } from '../types';
import { IEvents } from './base/events';

/**
 * Класс первой части закака товара
 */
export class Order extends Form<IOrder> {
	protected _paymentBtnOnline: HTMLButtonElement;
	protected _paymentBtnCash: HTMLButtonElement;
	readonly paymentActive = 'button_alt-active'; // селектор выбранного метода оплаты

	/**
	 * Конструктор первой части заказа
	 * @param container - корневой контейнер
	 * @param events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentBtnOnline = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.setPaymentHandler(this._paymentBtnOnline, 'online');
		this._paymentBtnCash = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this.setPaymentHandler(this._paymentBtnCash, 'cash');
	}

	/**
	 * Внутренний метод выставления обработчика выбора метода оплаты
	 * @param element - кнопка выбора метода оплаты
	 * @param payment - соотв. кнопке метод оплаты
	 */
	protected setPaymentHandler(
		element: HTMLButtonElement,
		payment: PaymentType
	) {
		element.addEventListener('click', () => {
			this.payment = payment;
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: payment,
			});
		});
	}

	/**
	 * Сеттер для адреса
	 */
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	/**
	 * Сеттер для метода оплаты
	 */
	set payment(paymentType: PaymentType) {
		if (!paymentType) {
			this._paymentBtnCash.classList.remove(this.paymentActive);
			this._paymentBtnOnline.classList.remove(this.paymentActive);
		} else {
			if (paymentType === 'online') {
				this._paymentBtnCash.classList.remove(this.paymentActive);
				this._paymentBtnOnline.classList.add(this.paymentActive);
			} else {
				this._paymentBtnOnline.classList.remove(this.paymentActive);
				this._paymentBtnCash.classList.add(this.paymentActive);
			}
		}
	}

	/**
	 * Геттер для метода оплаты
	 */
	get payment(): PaymentType {
		if (this._paymentBtnOnline.classList.contains(this.paymentActive))
			return 'online';
		if (this._paymentBtnCash.classList.contains(this.paymentActive))
			return 'cash';
		return null;
	}
}
