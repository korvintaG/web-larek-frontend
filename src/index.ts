import './scss/styles.scss';

import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { OrderContacts } from './components/OrderContacts';
import { Success } from './components/Success';
import { IOrder, IProduct } from './types';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(
	cloneTemplate(orderContactsTemplate),
	events
);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
		});
	});

	page.counter = appData.basket.length;
});

// открытие корзины
events.on('basket:open', () => {
	basket.items = appData.basket.map((itemID, i) => {
		const item = appData.catalog.find((el) => el.id === itemID);
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket_item:delete', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			itemIndex: i + 1,
		});
	});
	basket.total = appData.getBasketTotal();

	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// удаление товара из корзины
events.on('basket_item:delete', (item: IProduct) => {
	appData.delFromBasket(item.id);
	page.counter = appData.basket.length;
	events.emit('basket:open');
});

// Изменен открытый выбранный товар
events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('card:toggle', item),
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				buttonText: appData.isInBasket(item.id) ? 'Убрать' : 'Купить',
			}),
		});
	};

	if (item) {
		api
			.getProduct(item.id) // обновляем данные на всякий случай - вдруг изменились
			.then((result) => {
				item.description = result.description;
				item.category = result.category;
				item.price = result.price;
				item.image = result.image;
				item.title = result.title;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Открыть карточку
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// В корзину/из корзины
events.on('card:toggle', (item: IProduct) => {
	appData.toggleBasket(item.id);
	modal.close();
	page.counter = appData.basket.length;
});

// открытие заказа
events.on('order:open', () => {
	appData.orderPart = 1;
	modal.render({
		content: order.render({
			valid: false,
			errors: [],
			payment: null,
			address: '',
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// открываем контакты заказа
events.on('order:submit', () => {
	appData.order.payment = order.payment;
	appData.orderPart = 2;
	modal.render({
		content: orderContacts.render({
			valid: false,
			errors: [],
			email: '',
			phone: '',
		}),
	});
});

// завершаем формирование заказа
events.on('contacts:submit', () => {
	appData.order.items = appData.basket;
	appData.order.total = appData.getBasketTotal();
	api
		.orderProducts(appData.order)
		.then((result) => {
			appData.clearBasket();
			page.counter = 0;
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render(result),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось одно из полей при оформлении заказа
events.on(
	/^order\..*:change|^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	if (appData.orderPart === 1) {
		const { address, payment } = errors;
		order.valid = !address && !payment;
		order.errors = Object.values({ address, payment })
			.filter(Boolean)
			.join('; ');
	} else {
		const { email, phone } = errors;
		orderContacts.valid = !email && !phone;
		orderContacts.errors = Object.values({ phone, email })
			.filter(Boolean)
			.join('; ');
	}
});

// Первоначальное заполнение карточек товаров
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
