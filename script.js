document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    const productNameSelect = document.getElementById('productName');
    const specificationSelect = document.getElementById('specification');
    const unitPriceInput = document.getElementById('unitPrice');
    const quantityInput = document.getElementById('quantity');
    const additionalInput = document.getElementById('additional');
    const subtotalInput = document.getElementById('subtotal');
    const addToCartButton = document.getElementById('addToCart');
    const cartItemsList = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const submitOrderButton = document.getElementById('submitOrder');

    let cart = [];

    const products = {
        '綠豆椪': {
            '6入': 370,
            '12入': 740
        },
        '清豆沙': {
            '6入': 370,
            '12入': 740
        },
        '小月餅': {
            '12入': 480,
            '16入': 640
        },
        '玉果子': {
            '9入': 330
        },
        '香妃酥': {
            '12入': 420
        },
        '滷味燒': {
            '12入': 540
        },
        '綠茶酥': {
            '12入': 480
        },
        '素妙果（經濟包）': {
            '10入/包': 250,
            '12包/箱': 3000
        },
        '素妙果禮盒': {
            '16入': 415
        },
        '金鳳凰': {
            '12入': 480
        },
        '鳳梨酥': {
            '12入': 420
        },
        '貢餅': {
            '12入': 360
        },
        '月娘美': {
            '6入': 210
        },
        '月皇酥': {
            '6入': 240
        },
        '皓月明': {
            '6入': 240
        },
        '崇華禮盒': {
            '12入': 588
        },
        '黃金月餅': {
            '9入': 690
        },
        '全香芋': {
            '12入': 612
        },
        '全松子': {
            '12入': 564
        },
        '楓漾': {
            '單一規格': 468
        },
        '豐璨': {
            '單一規格': 660
        },
        '悅緣': {
            '單一規格': 670
        },
        '秋賞': {
            '單一規格': 494
        },
        '花賞': {
            '單一規格': 362
        },
        '楓絳': {
            '單一規格': 478
        },
        '大太陽餅': {
            '單一規格': 0
        },
        '小太陽餅': {
            '單一規格': 0
        },
        '手提袋': {
            '大': 0,
            '中': 0
        },
        '平放袋': {
            '單一規格': 0
        },
        '金線': {
            '單一規格': 0
        }
    };

    // 初始化品名下拉選單
    for (const product in products) {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        productNameSelect.appendChild(option);
    }

    productNameSelect.addEventListener('change', function() {
        const selectedProduct = this.value;
        specificationSelect.innerHTML = '<option value="">請選擇規格</option>';
        if (selectedProduct in products) {
            for (const spec in products[selectedProduct]) {
                const option = document.createElement('option');
                option.value = spec;
                option.textContent = spec;
                specificationSelect.appendChild(option);
            }
        }
        updateUnitPrice();
    });

    specificationSelect.addEventListener('change', updateUnitPrice);

    function updateUnitPrice() {
        const selectedProduct = productNameSelect.value;
        const selectedSpec = specificationSelect.value;
        if (selectedProduct in products && selectedSpec in products[selectedProduct]) {
            unitPriceInput.value = products[selectedProduct][selectedSpec];
        } else {
            unitPriceInput.value = '';
        }
        calculateSubtotal();
    }

    quantityInput.addEventListener('input', calculateSubtotal);
    additionalInput.addEventListener('input', calculateSubtotal);

    function calculateSubtotal() {
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        const additional = parseInt(additionalInput.value) || 0;
        const subtotal = unitPrice * (quantity + additional);
        subtotalInput.value = subtotal.toFixed(2);
    }

    addToCartButton.addEventListener('click', function() {
        const product = productNameSelect.value;
        const spec = specificationSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        const additional = parseInt(additionalInput.value) || 0;
        const subtotal = parseFloat(subtotalInput.value);
        const unitPrice = parseFloat(unitPriceInput.value) || 0;

        if (product && spec && quantity > 0 && unitPrice > 0) {
            cart.push({
                productName: product,
                specification: spec,
                unitPrice: unitPrice,
                quantity: quantity,
                additional: additional,
                subtotal: subtotal
            });

            updateCartDisplay();
            form.reset();
            specificationSelect.innerHTML = '<option value="">請選擇規格</option>';
            unitPriceInput.value = '';
            subtotalInput.value = '';
        } else if (unitPrice === 0) {
            alert('此產品暫無價格，請聯繫客服獲取更多信息。');
        } else {
            alert('請填寫完整的商品資訊');
        }
    });

    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.productName} (${item.specification}) - 數量: ${item.quantity + item.additional} - 小計: ${item.subtotal}`;
            
            const removeButton = document.createElement('button');
            removeButton.textContent = '移除';
            removeButton.onclick = () => removeFromCart(index);
            
            li.appendChild(removeButton);
            cartItemsList.appendChild(li);

            total += item.subtotal;
        });

        totalPriceSpan.textContent = total.toFixed(2);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    }

    submitOrderButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('購物車是空的，請先加入商品');
            return;
        }

        const orderInfo = {
            items: cart,
            totalPrice: parseFloat(totalPriceSpan.textContent),
            orderDate: new Date().toLocaleString()
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderInfo);
        localStorage.setItem('orders', JSON.stringify(orders));

        alert('訂單已提交並保存！');
        cart = [];
        updateCartDisplay();
        displayOrders();
    });

    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        let ordersHTML = '<h2>已提交的訂單</h2>';
        
        if (orders.length === 0) {
            ordersHTML += '<p>暫無訂單</p>';
        } else {
            ordersHTML += '<ul>';
            orders.forEach((order, index) => {
                ordersHTML += `
                    <li>
                        訂單 ${index + 1}:<br>
                        訂單日期: ${order.orderDate}<br>
                        商品列表:<br>
                        <ul>
                            ${order.items.map(item => `
                                <li>
                                    ${item.productName} (${item.specification}) - 
                                    數量: ${item.quantity + item.additional} - 
                                    小計: ${item.subtotal}
                                </li>
                            `).join('')}
                        </ul>
                        總價: ${order.totalPrice}
                    </li>
                `;
            });
            ordersHTML += '</ul>';
        }

        let ordersDisplay = document.getElementById('ordersDisplay');
        if (!ordersDisplay) {
            ordersDisplay = document.createElement('div');
            ordersDisplay.id = 'ordersDisplay';
            document.body.appendChild(ordersDisplay);
        }
        ordersDisplay.innerHTML = ordersHTML;
    }

    displayOrders();
});