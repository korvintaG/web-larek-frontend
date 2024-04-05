import { Category } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

/**
 * Интерфейс карточки
 */
export interface ICard {
	id: string;
	title: string;
	description?: string;
	image?: string;
	price: number;
	category?: Category;
	buttonText?: string;
	itemIndex?: number;
}

/**
 * Интерфейс действий с карточкой
 */
interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

/**
 * Класс карточки с возможностью вариативного использования в разных местах
 */
export class Card<T> extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;
	protected _itemIndex?: HTMLElement; // № п/п

	/**
	 * Конструктор карточки
	 * @param blockName - имя блока
	 * @param container - корневой контейнер
	 * @param actions - действия с карточкой
	 */
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._itemIndex = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		if (value) this.setText(this._price, `${value} синапсов`);
		else this.setText(this._price, `Бесценно`);
	}

	get price(): number | null {
		const pricet = this._price.textContent;
		if (pricet === 'Бесценно') return null;
		else return Number(pricet.split(' ')[0]);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.remove(...this._category.classList);
		this._category.classList.add(`${this.blockName}__category`);
		const cat = settings.categoryClass.get(value);
		this._category.classList.add(`${this.blockName}__category_${cat}`);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set buttonText(value: string) {
		if (this._button) this.setText(this._button, value);
	}
	set itemIndex(value: number) {
		if (this._itemIndex) this.setText(this._itemIndex, String(value));
	}
}
