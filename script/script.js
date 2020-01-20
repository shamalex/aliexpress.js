document.addEventListener('DOMContentLoaded', function(){

	"use strict";

	const search = document.querySelector('.search');
	const cartBtn = document.getElementById('cart');
	const wishlistBtn =document.getElementById('wishlist');
	const goodsWrapper = document.querySelector('.goods-wrapper');
	const cart = document.querySelector('.cart');
	const category = document.querySelector('.category');
	const cardCounter = cartBtn.querySelector('.counter');
	const whishListCounter = wishlistBtn.querySelector('.counter');
	const cartWrapper = document.querySelector('.cart-wrapper');


	const wishlist = [];
	const goodsBasket = {};

	const loading = (nameFunc) => {
		const spiner = `<div id="spinner">
			<div class="spinner-loading"><div><div><div></div>
			</div><div><div></div></div><div><div></div></div>
			<div><div></div></div></div></div></div>`;
		if (nameFunc === 'renderCard'){
			goodsWrapper.innerHTML = spiner;
		}
		if (nameFunc === 'renderBasket') {
			cartWrapper.innerHTML = spiner;
		}
	};

	// Запрос на сервер
	const getGoods = (handler, filter) => {
		loading(handler.name);
		fetch('db/db.json')
			.then(response => response.json())
			.then(filter)
			.then(handler);
	};

	// Герация карточек
	const createCardGoods = (id, title, price, img) => {
		const card = document.createElement('div');
		card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
		card.innerHTML = `<div class="card">
							<div class="card-img-wrapper">
								<img class="card-img-top" src="${img}" alt="${title}">
								<button 
									class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
									data-goods-id="${id}">
								</button>
							</div>
							<div class="card-body justify-content-between">
								<a href="#" class="card-title">${title}</a>
								<div class="card-price">${price} ₽</div>
								<div>
									<button 
										class="card-add-cart" 
										data-goods-id="${id}">Добавить в корзину
									</button>
								</div>
							</div>
						</div>`;
		return card;
	};
	const createCardGoodsBasket = (id, title, price, img) => {
		const card = document.createElement('div');
		card.className = 'goods';
		card.innerHTML = `<div class="goods-img-wrapper">
						<img class="goods-img" src="${img}" alt="">

					</div>
					<div class="goods-description">
						<h2 class="goods-title">${title}</h2>
						<p class="goods-price">${price} ₽</p>

					</div>
					<div class="goods-price-count">
						<div class="goods-trigger">
							<button 
								class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" 
								data-goods-id="${id}">
							</button>
							<button class="goods-delete" data-goods-id="${id}"></button>
						</div>
						<div class="goods-count">${goodsBasket[id]}</div>
					</div>`;
		return card;
	};
	
	// рендеры карточек
	const renderCard = (items) =>{
		goodsWrapper.textContent = '';

		if (items.length) {
			items.forEach(({ id, title, price, imgMin }) => {
				goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
			})
		} else {
			goodsWrapper.textContent = 'Извените мы не нашли товаров по вашему запросу';
		}	
	};
	const renderBasket = (items) =>{
		cartWrapper.textContent = '';

		if (items.length) {
			items.forEach(({ id, title, price, imgMin }) => {
				cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
			})
		} else {
			cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
		}	
	};

	//калькуляция
	const calcTotalPrice = (goods) => {
		let sum = 0;
		for (const item of goods) {
			sum += item.price * goodsBasket[item.id];
		}
		cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
	};
	const chechCount = () => {
		whishListCounter.textContent = wishlist.length;
		cardCounter.textContent = Object.keys(goodsBasket).length; //возвращает массив ключей
	};

	//фильтры
	const showCardBasket = (goods) => {
		const backetGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id)); //поиск в объекте по id
		calcTotalPrice(backetGoods);
		return backetGoods
	};
	const randowSort = (item) => {

		return item.sort(() => Math.random() - 0.5);
	};
	const showWishlist = () => {

		getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)));
	};

	//работа с хронилащами
	const getCookie = (name) => {
		// возвращает куки с указанным name,
		// или undefined, если ничего не найдено
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	const cookieQuery = (get) => {
		if (get) {
			if (getCookie('goodsBasket')) {
				Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
				// goodsBasket = JSON.parse(getCookie('goodsBasket'));
			}
			chechCount();
		} else {
			document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
		}
	}
	const storageQuery = (get) => {
		if (get) {
			if (localStorage.getItem('whishlist')) {
				wishlist.push(...JSON.parse(localStorage.getItem('whishlist')));
				// JSON.parse(localStorage.getItem('whishlist')).forEach(id => wishlist.push(id));
			}
			chechCount();
		} else {
			localStorage.setItem('whishlist', JSON.stringify(wishlist));
		}
	};

	//события
	const closeCart = (e) => {
		const target = e.target;
		if (target === cart ||
			target.classList.contains('cart-close') ||
			e.keyCode === 27) {
				cart.style.display = '';
				document.removeEventListener('keyup', closeCart);
		}
	};
	const opneCart = (e) => {
		e.preventDefault();
		cart.style.display = 'flex';
		document.addEventListener('keyup', closeCart);
		getGoods(renderBasket, showCardBasket);
	};
	const choiceCategory = (e) => {
		e.preventDefault();
		const target = e.target;
		
		if (target.classList.contains('category-item')) {
			const category = target.dataset.category;
			getGoods(renderCard, 
					(goods) => goods.filter((item) => item.category.includes(category)));
		}
	};
	const searchGoods = (e) => {
		e.preventDefault();
		const input = e.target.elements.searchGoods;
		const inputValue = input.value.trim();

		if (inputValue !== '') {
			const searchString = new RegExp(inputValue, 'i')
			getGoods(renderCard, 
				(goods) => goods.filter((item) => searchString.test(item.title)));
		} else {
			search.classList.add('error');
			setTimeout(() => {
				search.classList.remove('error');
			}, 2000);
		}

		input.value = '';
	};
	const toogleWhishList = (id, elem) => {
		if (wishlist.includes(id)) { //проверка или есть в массиве
			wishlist.splice(wishlist.indexOf(id), 1);
			elem.classList.remove('active');
		} else {
			wishlist.push(id);
			elem.classList.add('active');
		}
		chechCount();
		storageQuery();
	};
	const addBasket = (id) => {
		if (goodsBasket[id]) {
			goodsBasket[id] += 1;
		} else {
			goodsBasket[id] = 1;
		}
		chechCount();
		cookieQuery();
	};
	const removeGoods = (id) => {
		delete goodsBasket[id];
		chechCount();
		cookieQuery();
		getGoods(renderBasket, showCardBasket);
	};

	
	//handler
	const handlerGoods = (e) => {
		const target = e.target;

		if (target.classList.contains('card-add-wishlist')) {
			toogleWhishList(target.dataset.goodsId, target);
		}
		if (target.classList.contains('card-add-cart')) {
			addBasket(target.dataset.goodsId);
		}
	};
	const handlerBasket = (e) => {
		const target = e.target;
		if (target.classList.contains('goods-add-wishlist')) {
			toogleWhishList(target.dataset.goodsId, target);
		}
		if (target.classList.contains('goods-delete')) {
			removeGoods(target.dataset.goodsId);
		}
	};

	//инициализация
	{
		getGoods(renderCard, randowSort);
		storageQuery(true);
		cookieQuery(true);
	
		cartBtn.addEventListener('click', opneCart);
		cart.addEventListener('click', closeCart);
		category.addEventListener('click', choiceCategory);
		search.addEventListener('submit', searchGoods);
		goodsWrapper.addEventListener('click', handlerGoods);
		cartWrapper.addEventListener('click', handlerBasket);
		wishlistBtn.addEventListener('click', showWishlist);
	}
});