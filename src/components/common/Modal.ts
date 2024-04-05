import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

/**
 * Интерфейс модального окна
 */
interface IModalData {
	content: HTMLElement;
}

/**
 * Универсальный класс модального окна
 */
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	/**
	 * Конструктор модального окна
	 * @param container - корневой контейнер
	 * @param events - брокер событий
	 */
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	/**
	 * Сеттер контента
	 */
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	/**
	 * Открыть модальное окно
	 */
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	/**
	 * Закрыть модальное окно
	 */
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	/**
	 * Рендер модального окна
	 * @param data - каие -то данные
	 * @returns DOM элемент
	 */
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
