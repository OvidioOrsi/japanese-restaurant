let cart = []; 
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

comidaJson.forEach((item, index) => {
    let comidaItem = c('.models .sushi-item').cloneNode(true);

    comidaItem.setAttribute('data-key', index);

    comidaItem.querySelector('.sushi-item--img img').src = item.img;
    comidaItem.querySelector('.sushi-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    comidaItem.querySelector('.sushi-item--name').innerHTML = item.name;
    comidaItem.querySelector('.sushi-item--desc').innerHTML = item.description;

    comidaItem.querySelector('.sushi-item a').addEventListener('click', (event) => {
        event.preventDefault();

        let key = event.target.closest('.sushi-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        c('.sushiBig img').src = comidaJson[key].img;
        c('.sushiInfo h1').innerHTML = comidaJson[key].name;
        c('.sushiInfo .sushiInfo--desc').innerHTML = comidaJson[key].description;
        c('.sushiInfo--actualPrice').innerHTML = `R$ ${comidaJson[key].price.toFixed(2)}`;
        c('.sushiInfo--size.selected').classList.remove('selected');
        cs('.sushiInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = comidaJson[key].sizes[sizeIndex];
        })

        c('.sushiInfo--qt').innerHTML = modalQt;
        
        c('.sushiWindowArea').style.opacity = 0;
        c('.sushiWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.sushiWindowArea').style.opacity = 1;
        }, 200)
    });

    c('.sushi-area').append(comidaItem);
});

function closeModal() {
    c('.sushiWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.sushiWindowArea').style.display = 'none';
    }, 500)
}
cs('.sushiInfo--cancelButton, sushiInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

c('.sushiInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.sushiInfo--qt').innerHTML = modalQt;
});
c('.sushiInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.sushiInfo--qt').innerHTML = modalQt;
    }
});

cs('.sushiInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        c('.sushiInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})

c('.sushiInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.sushiInfo--size.selected').getAttribute('data-key'));
    let identifier = comidaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: comidaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let sushiItem = comidaJson.find((item) => item.id == cart[i].id);
            subtotal += sushiItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);

            let sushiSizeName;
            if (cart[i].size == 0) {
                sushiSizeName = '3un';
            } else if (cart[i].size == 1) {
                sushiSizeName = '6un';
            } else {
                sushiSizeName = '9un';
            };

            let sushiName = `${sushiItem.name} (${sushiSizeName})`;

            cartItem.querySelector('img').src = sushiItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = sushiName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                    updateCart();
                } else {
                    // removendo o item do carrinho
                    cart.splice(i, 1);
                    updateCart();
                }
            });
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}