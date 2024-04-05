import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

/**
 * Интерфейс для главной страницы проекта
 */
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

/**
 * Класс главной страницы проекта
 */
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	/**
	 * Конструктор для главной страницы проекта
	 * @param container - корневой контейнер
	 * @param events - броекр событий
	 */
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	/**
	 * Сеттер для сетчика корзины
	 */
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	/**
	 * Сеттер для каталога товаров
	 */
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	/**
	 * Блокировщик главной страницы (нужен для корректной работы модальных окон)
	 */
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
