import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

/**
 * Интерфейс состояния формы
 */
interface IFormState {
    valid: boolean;
    errors: string[];
}

/**
 * Универсальный компонент формы
 */
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    /**
     * Конструктор формы
     * @param container - корневой контейнер
     * @param events - брокер событий
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    /**
     * Внутренний метод - на изменение поля ввода формимрует соотв. кастомное событие
     * @param field - поле ввода
     * @param value - значение поля ввода
     */
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    /**
     * Сеттер установки валидности формы
     */
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    /**
     * Сеттер установки текста ошибки формы
     */
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    /**
     * Рендер формы
     * @param state - данные формы 
     * @returns DOM элемент
     */
    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}