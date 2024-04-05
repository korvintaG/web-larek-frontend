import {Component} from "./base/Component";
import {createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

/**
 * Интерфейс корзины
 */
interface IBasketView {
    items: HTMLElement[];
    total: number;
}

/**
 * Класс корзины
 */
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    /**
     * Конструктор корзины 
     * @param container - корневой контейнер
     * @param events - брокер событий
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        this.items = [];
    }

    /**
     * Установить спсиок товаров в корзине
     */
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
        this.setDisabled(this._button,items.length === 0);
    }

    /**
     * Установить итоговую сумму корзины
     */
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}