"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  var search = document.querySelector('.search');
  var cartBtn = document.getElementById('cart');
  var wishlistBtn = document.getElementById('wishlist');
  var goodsWrapper = document.querySelector('.goods-wrapper');
  var cart = document.querySelector('.cart');
  var category = document.querySelector('.category');
  var cardCounter = cartBtn.querySelector('.counter');
  var whishListCounter = wishlistBtn.querySelector('.counter');
  var cartWrapper = document.querySelector('.cart-wrapper');
  var wishlist = [];
  var goodsBasket = {};

  var loading = function loading(nameFunc) {
    var spiner = "<div id=\"spinner\">\n\t\t\t<div class=\"spinner-loading\"><div><div><div></div>\n\t\t\t</div><div><div></div></div><div><div></div></div>\n\t\t\t<div><div></div></div></div></div></div>";

    if (nameFunc === 'renderCard') {
      goodsWrapper.innerHTML = spiner;
    }

    if (nameFunc === 'renderBasket') {
      cartWrapper.innerHTML = spiner;
    }
  }; // Запрос на сервер


  var getGoods = function getGoods(handler, filter) {
    loading(handler.name);
    fetch('db/db.json').then(function (response) {
      return response.json();
    }).then(filter).then(handler);
  }; // Герация карточек


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "<div class=\"card\">\n\t\t\t\t\t\t\t<div class=\"card-img-wrapper\">\n\t\t\t\t\t\t\t\t<img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"").concat(title, "\">\n\t\t\t\t\t\t\t\t<button \n\t\t\t\t\t\t\t\t\tclass=\"card-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\"\n\t\t\t\t\t\t\t\t\tdata-goods-id=\"").concat(id, "\">\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"card-body justify-content-between\">\n\t\t\t\t\t\t\t\t<a href=\"#\" class=\"card-title\">").concat(title, "</a>\n\t\t\t\t\t\t\t\t<div class=\"card-price\">").concat(price, " \u20BD</div>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<button \n\t\t\t\t\t\t\t\t\t\tclass=\"card-add-cart\" \n\t\t\t\t\t\t\t\t\t\tdata-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>");
    return card;
  };

  var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = "<div class=\"goods-img-wrapper\">\n\t\t\t\t\t\t<img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-description\">\n\t\t\t\t\t\t<h2 class=\"goods-title\">").concat(title, "</h2>\n\t\t\t\t\t\t<p class=\"goods-price\">").concat(price, " \u20BD</p>\n\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-price-count\">\n\t\t\t\t\t\t<div class=\"goods-trigger\">\n\t\t\t\t\t\t\t<button \n\t\t\t\t\t\t\t\tclass=\"goods-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\" \n\t\t\t\t\t\t\t\tdata-goods-id=\"").concat(id, "\">\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n\t\t\t\t\t</div>");
    return card;
  }; // рендеры карточек


  var renderCard = function renderCard(items) {
    goodsWrapper.textContent = '';

    if (items.length) {
      items.forEach(function (_ref) {
        var id = _ref.id,
            title = _ref.title,
            price = _ref.price,
            imgMin = _ref.imgMin;
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = 'Извените мы не нашли товаров по вашему запросу';
    }
  };

  var renderBasket = function renderBasket(items) {
    cartWrapper.textContent = '';

    if (items.length) {
      items.forEach(function (_ref2) {
        var id = _ref2.id,
            title = _ref2.title,
            price = _ref2.price,
            imgMin = _ref2.imgMin;
        cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
    }
  }; //калькуляция


  var calcTotalPrice = function calcTotalPrice(goods) {
    var sum = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = goods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        sum += item.price * goodsBasket[item.id];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
  };

  var chechCount = function chechCount() {
    whishListCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length; //возвращает массив ключей
  }; //фильтры


  var showCardBasket = function showCardBasket(goods) {
    var backetGoods = goods.filter(function (item) {
      return goodsBasket.hasOwnProperty(item.id);
    }); //поиск в объекте по id

    calcTotalPrice(backetGoods);
    return backetGoods;
  };

  var randowSort = function randowSort(item) {
    return item.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var showWishlist = function showWishlist() {
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishlist.includes(item.id);
      });
    });
  }; //работа с хронилащами


  var getCookie = function getCookie(name) {
    // возвращает куки с указанным name,
    // или undefined, если ничего не найдено
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsBasket')) {
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket'))); // goodsBasket = JSON.parse(getCookie('goodsBasket'));
      }

      chechCount();
    } else {
      document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e3");
    }
  };

  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('whishlist')) {
        wishlist.push.apply(wishlist, _toConsumableArray(JSON.parse(localStorage.getItem('whishlist')))); // JSON.parse(localStorage.getItem('whishlist')).forEach(id => wishlist.push(id));
      }

      chechCount();
    } else {
      localStorage.setItem('whishlist', JSON.stringify(wishlist));
    }
  }; //события


  var closeCart = function closeCart(e) {
    var target = e.target;

    if (target === cart || target.classList.contains('cart-close') || e.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeCart);
    }
  };

  var opneCart = function opneCart(e) {
    e.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderBasket, showCardBasket);
  };

  var choiceCategory = function choiceCategory(e) {
    e.preventDefault();
    var target = e.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      });
    }
  };

  var searchGoods = function searchGoods(e) {
    e.preventDefault();
    var input = e.target.elements.searchGoods;
    var inputValue = input.value.trim();

    if (inputValue !== '') {
      var searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      search.classList.add('error');
      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    }

    input.value = '';
  };

  var toogleWhishList = function toogleWhishList(id, elem) {
    if (wishlist.includes(id)) {
      //проверка или есть в массиве
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    }

    chechCount();
    storageQuery();
  };

  var addBasket = function addBasket(id) {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }

    chechCount();
    cookieQuery();
  };

  var removeGoods = function removeGoods(id) {
    delete goodsBasket[id];
    chechCount();
    cookieQuery();
    getGoods(renderBasket, showCardBasket);
  }; //handler


  var handlerGoods = function handlerGoods(e) {
    var target = e.target;

    if (target.classList.contains('card-add-wishlist')) {
      toogleWhishList(target.dataset.goodsId, target);
    }

    if (target.classList.contains('card-add-cart')) {
      addBasket(target.dataset.goodsId);
    }
  };

  var handlerBasket = function handlerBasket(e) {
    var target = e.target;

    if (target.classList.contains('goods-add-wishlist')) {
      toogleWhishList(target.dataset.goodsId, target);
    }

    if (target.classList.contains('goods-delete')) {
      removeGoods(target.dataset.goodsId);
    }
  }; //инициализация


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