const itemDatabase = {
    'sword': { value: 50, rarity: 'common' },
    'diamond': { value: 200, rarity: 'rare' },
    'gold': { value: 75, rarity: 'uncommon' },
    'emerald': { value: 150, rarity: 'rare' },
    'ruby': { value: 180, rarity: 'rare' },
    'obsidian': { value: 100, rarity: 'uncommon' },
    'crystal': { value: 250, rarity: 'epic' },
    'legendary': { value: 500, rarity: 'legendary' },
    'common': { value: 10, rarity: 'common' },
    'rare': { value: 100, rarity: 'rare' },
    'epic': { value: 300, rarity: 'epic' },
};

function searchItem() {
    const itemName = document.getElementById('item-name').value.toLowerCase().trim();
    const resultDiv = document.getElementById('item-result');
    const suggestionsDiv = document.getElementById('item-suggestions');

    if (!itemName) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Enter an item name</span>';
        suggestionsDiv.innerHTML = '';
        return;
    }

    const item = itemDatabase[itemName];

    if (item) {
        const result = `
            <div class="result-good">
                <strong>${itemName.toUpperCase()}</strong><br>
                Value: <strong>${item.value}</strong><br>
                Rarity: <strong>${item.rarity}</strong>
            </div>
        `;
        resultDiv.innerHTML = result;
        suggestionsDiv.innerHTML = '';
    } else {
        const similar = Object.keys(itemDatabase).filter(key => 
            key.includes(itemName) || itemName.includes(key)
        );

        if (similar.length > 0) {
            let suggestionsHtml = '<div style="margin-top: 10px;"><strong>Similar items:</strong><br>';
            similar.forEach(sim => {
                suggestionsHtml += `<a href="#" onclick="selectItem('${sim}'); return false;" style="color: #00ff41; text-decoration: underline; margin-right: 10px;">${sim}</a><br>`;
            });
            suggestionsHtml += '</div>';
            suggestionsDiv.innerHTML = suggestionsHtml;
            resultDiv.innerHTML = '<span class="result-neutral">Item not found. Try suggestions below.</span>';
        } else {
            resultDiv.innerHTML = '<span class="result-warning">⚠️ Item not found in database</span>';
            suggestionsDiv.innerHTML = '';
        }
    }
}

function selectItem(itemName) {
    document.getElementById('item-name').value = itemName;
    searchItem();
}

function calculateTrade() {
    const offerValue = parseFloat(document.getElementById('offer-value').value);
    const receiveValue = parseFloat(document.getElementById('receive-value').value);
    const resultDiv = document.getElementById('trade-result');

    if (!offerValue || !receiveValue || offerValue <= 0 || receiveValue <= 0) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Enter valid offer and receive values</span>';
        return;
    }

    const difference = receiveValue - offerValue;
    const percentDiff = (difference / offerValue * 100).toFixed(1);
    let fairness = '';
    let className = '';

    if (Math.abs(percentDiff) <= 5) {
        fairness = '✅ Fair Trade';
        className = 'result-good';
    } else if (percentDiff > 5 && percentDiff <= 15) {
        fairness = '✅ Good for You';
        className = 'result-good';
    } else if (percentDiff > 15) {
        fairness = '⚠️ Very Favorable for You';
        className = 'result-neutral';
    } else if (percentDiff < -5 && percentDiff >= -15) {
        fairness = '⚠️ Slight Loss';
        className = 'result-neutral';
    } else {
        fairness = '❌ Bad Trade for You';
        className = 'result-warning';
    }

    const result = `
        <div class="${className}">
            <strong>Your Offer:</strong> ${offerValue.toFixed(2)}<br>
            <strong>You Receive:</strong> ${receiveValue.toFixed(2)}<br>
            <strong>Difference:</strong> ${difference > 0 ? '+' : ''}${difference.toFixed(2)} (${percentDiff > 0 ? '+' : ''}${percentDiff}%)<br>
            <strong>Fairness:</strong> ${fairness}
        </div>
    `;
    resultDiv.innerHTML = result;
}

function calculateBulk() {
    const price = parseFloat(document.getElementById('item-price').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const discount = parseFloat(document.getElementById('discount-percent').value);
    const resultDiv = document.getElementById('bulk-result');

    if (!price || !quantity || price <= 0 || quantity <= 0 || discount < 0) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Enter valid values</span>';
        return;
    }

    const subtotal = price * quantity;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    const perItem = total / quantity;

    const result = `
        <div class="result-good">
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}<br>
            <strong>Discount (-${discount}%):</strong> -${discountAmount.toFixed(2)}<br>
            <strong>Total:</strong> ${total.toFixed(2)}<br>
            <strong>Price per Item:</strong> ${perItem.toFixed(2)}
        </div>
    `;
    resultDiv.innerHTML = result;
}

function calculateProfit() {
    const buyPrice = parseFloat(document.getElementById('buy-price').value);
    const sellPrice = parseFloat(document.getElementById('sell-price').value);
    const quantity = parseFloat(document.getElementById('quantity-profit').value);
    const resultDiv = document.getElementById('profit-result');

    if (!buyPrice || !sellPrice || !quantity || buyPrice < 0 || sellPrice < 0 || quantity <= 0) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Enter valid values</span>';
        return;
    }

    const totalCost = buyPrice * quantity;
    const totalRevenue = sellPrice * quantity;
    const profit = totalRevenue - totalCost;
    const profitMargin = (profit / totalCost * 100).toFixed(1);
    let profitStatus = profit >= 0 ? 'result-good' : 'result-warning';

    const result = `
        <div class="${profitStatus}">
            <strong>Total Cost:</strong> ${totalCost.toFixed(2)}<br>
            <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}<br>
            <strong>Profit:</strong> ${profit.toFixed(2)}<br>
            <strong>Profit Margin:</strong> ${profitMargin}%
        </div>
    `;
    resultDiv.innerHTML = result;
}

function calculateROI() {
    const initial = parseFloat(document.getElementById('initial-investment').value);
    const current = parseFloat(document.getElementById('current-value').value);
    const resultDiv = document.getElementById('roi-result');

    if (!initial || !current || initial <= 0 || current < 0) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Enter valid values</span>';
        return;
    }

    const gain = current - initial;
    const roi = (gain / initial * 100).toFixed(1);
    let roiStatus = roi >= 0 ? 'result-good' : 'result-warning';

    const result = `
        <div class="${roiStatus}">
            <strong>Initial Investment:</strong> ${initial.toFixed(2)}<br>
            <strong>Current Value:</strong> ${current.toFixed(2)}<br>
            <strong>Gain/Loss:</strong> ${gain.toFixed(2)}<br>
            <strong>ROI:</strong> ${roi > 0 ? '+' : ''}${roi}%
        </div>
    `;
    resultDiv.innerHTML = result;
}

function addTradeRow(type) {
    const containerId = type === 'offer' ? 'trade-items-container' : 'trade-receive-container';
    const container = document.getElementById(containerId);
    
    const row = document.createElement('div');
    row.className = 'trade-item-row';
    row.innerHTML = `
        <div class="input-group">
            <input type="text" class="${type}-item" placeholder="Item name" maxlength="30">
            <input type="number" class="${type}-qty" placeholder="Qty" min="1" value="1">
            <input type="number" class="${type}-value" placeholder="Price each" min="0" step="0.01">
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 5px; padding: 8px; background: #ff6b6b;">✕</button>
        </div>
    `;
    container.appendChild(row);
}

function compareMultiTrade() {
    const offerRows = document.querySelectorAll('#trade-items-container .trade-item-row');
    const receiveRows = document.querySelectorAll('#trade-receive-container .trade-item-row');
    const resultDiv = document.getElementById('multi-trade-result');

    let offerTotal = 0;
    let receiveTotal = 0;
    let offerDetails = '<strong>Offering:</strong><br>';
    let receiveDetails = '<strong>Receiving:</strong><br>';

    offerRows.forEach(row => {
        const name = row.querySelector('.offer-item').value || 'Unknown';
        const qty = parseFloat(row.querySelector('.offer-qty').value) || 0;
        const value = parseFloat(row.querySelector('.offer-value').value) || 0;
        const subtotal = qty * value;
        if (subtotal > 0) {
            offerTotal += subtotal;
            offerDetails += `${name} x${qty} @ ${value} = ${subtotal.toFixed(2)}<br>`;
        }
    });

    receiveRows.forEach(row => {
        const name = row.querySelector('.receive-item').value || 'Unknown';
        const qty = parseFloat(row.querySelector('.receive-qty').value) || 0;
        const value = parseFloat(row.querySelector('.receive-value').value) || 0;
        const subtotal = qty * value;
        if (subtotal > 0) {
            receiveTotal += subtotal;
            receiveDetails += `${name} x${qty} @ ${value} = ${subtotal.toFixed(2)}<br>`;
        }
    });

    if (offerTotal === 0 || receiveTotal === 0) {
        resultDiv.innerHTML = '<span class="result-warning">⚠️ Add items to both sides of the trade</span>';
        return;
    }

    const difference = receiveTotal - offerTotal;
    const percentDiff = (difference / offerTotal * 100).toFixed(1);
    let fairness = '';
    let className = '';

    if (Math.abs(percentDiff) <= 5) {
        fairness = '✅ Fair Trade';
        className = 'result-good';
    } else if (percentDiff > 5) {
        fairness = percentDiff > 15 ? '⚠️ Very Favorable for You' : '✅ Good for You';
        className = percentDiff > 15 ? 'result-neutral' : 'result-good';
    } else {
        fairness = percentDiff < -15 ? '❌ Bad Trade for You' : '⚠️ Slight Loss';
        className = percentDiff < -15 ? 'result-warning' : 'result-neutral';
    }

    const result = `
        <div class="${className}">
            ${offerDetails}
            <strong>Offer Total: ${offerTotal.toFixed(2)}</strong><br><br>
            ${receiveDetails}
            <strong>Receive Total: ${receiveTotal.toFixed(2)}</strong><br><br>
            <strong>Difference: ${difference > 0 ? '+' : ''}${difference.toFixed(2)} (${percentDiff > 0 ? '+' : ''}${percentDiff}%)</strong><br>
            <strong>Fairness: ${fairness}</strong>
        </div>
    `;
    resultDiv.innerHTML = result;
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const button = this.closest('.calculator-section').querySelector('button');
                if (button) button.click();
            }
        });
    });
});
