function stringToValue(string) {
    var result = string.split('').reverse();
    var count = parseInt(result.length / 3);
    var index = -1;
    while (count > 0) {
        index += 4;
        if (index == result.length) break;
        for (var i = result.length - 1; i >= index; i--) {
            result[i + 1] = result[i];
        }
        result[index] = '.';
        count--;
    }
    return result.reverse().join('');
}

function printMoney(element, price) {
    element.innerHTML = stringToValue(`${price}`) + 'đ';
    var btnTotalBuy = $('.cart-total-buy');
    btnTotalBuy.onclick = function () {
        if (!price) {
            alert('Bạn chưa mua hàng');
        } else {
            alert(
                'Thanh toán thành công. Tổng tiền của bạn là: ' +
                    element.innerHTML
            );
        }
    };
}

//In sản phẩm
var cartList = $('.cart-list');
var totalMoney = $('.cart-total-money');
var html = '';
var sum = 0;
for (var i = 0; i < 36; i++) {
    var cartItem = JSON.parse(localStorage.getItem(i));
    if (cartItem !== null) {
        html += `<li class="cart-item" id="${i}">
                <img src="${cartItem.img}" alt="" class="cart-img" />
                <div class="cart-content">
                    <span class="cart-name">${cartItem.name}</span>
                    <span class="cart-price">${cartItem.price}</span>
                    <input
                        class="cart-quanlity"
                        value="1"
                        max="10"
                        min="0"
                        id="cart-${i}"
                        value="1"
                        type="number"
                    />
                    <span class="cart-sum-price">${cartItem.price}</span>
                </div>
                <button class="cart-delete">X</button>
            </li>`;
        cartList.innerHTML = html;
        sum += parseInt(cartItem.price);
    }
}
printMoney(totalMoney, sum);

//Đổi số lượng
var cartItems = document.querySelectorAll('.cart-item');
var arrCartItems = Array.from(cartItems);
arrCartItems.forEach(function (cartItem) {
    var cartPrice = cartItem.querySelector('.cart-price');
    var cartQuanlity = cartItem.querySelector('.cart-quanlity');
    var cartSumPrice = cartItem.querySelector('.cart-sum-price');
    cartQuanlity.onmousedown = function (e) {
        var oldValue = e.target.value; //số lượng trước khi thay đổi
        cartQuanlity.onchange = function (e) {
            sum -= oldValue * parseInt(cartPrice.innerHTML); //giảm giá về 0
            cartQuanlity.setAttribute('disabled', 'disabled');
            setTimeout(function () {
                var price = e.target.value * parseInt(cartPrice.innerHTML);
                cartSumPrice.innerHTML = price;
                sum += e.target.value * parseInt(cartPrice.innerHTML); //tăng giá với số lượng mới
                printMoney(totalMoney, sum);
                cartQuanlity.removeAttribute('disabled');
            }, 500);
        };
    };
});

//Delete
arrCartItems.forEach(function (cartItem) {
    var cartDelete = cartItem.querySelector('.cart-delete');
    cartDelete.onclick = function (e) {
        //in ra giá sau khi xóa
        var cartPrice = cartItem.querySelector('.cart-price');
        var cartQuanlity = cartItem.querySelector('.cart-quanlity');
        sum -= cartQuanlity.value * parseInt(cartPrice.innerHTML);
        printMoney(totalMoney, sum);

        //xóa sản phẩm khỏi layout và localStorage
        e.target.parentElement.remove();
        var keyName = e.target.parentElement.getAttribute('id');
        localStorage.removeItem(keyName);
        window.location.reload();
    };
});

var cartTitle = $('.cart-title');
if (localStorage.getItem('user')) {
    if (localStorage.length == 1) {
        cartList.innerHTML = `<h2 class="no-product">
            GIỎ HÀNG TRỐNG
       </h2>`;
        cartTitle.style.display = 'none';
    }
} else if (!localStorage.length) {
    cartList.innerHTML = `<h2 class="no-product">
            GIỎ HÀNG TRỐNG
       </h2>`;
    cartTitle.style.display = 'none';
}

window.addEventListener('storage', () => {
    window.location.reload();
});
