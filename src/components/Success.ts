import { Component } from './base/Component';
import { ensureElement } from './../utils/utils';

/**
 * Интерфейс для данных успешного заказа
 */
interface ISuccess {
	total: number;
}

/**
 * Интерфейс для действий в окне успешного заказа
 */
interface ISuccessActions {
	onClick: () => void;
}

/**
 * Класс окна успешного заказа
 */
export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	/**
	 * Конструктор успеха в заказе
	 * @param container - корневой контейнер
	 * @param actions - действия
	 */
	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Сеттер общей суммы принятого заказа
	 */
	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
