// Rental price calculator + small UI helpers (no libraries)
(function () {
  const form = document.getElementById('rental-form');
  const item = document.getElementById('item');
  const issue = document.getElementById('issue');
  const ret = document.getElementById('return');
  const total = document.getElementById('total');
  const daysText = document.getElementById('days-text');
  const message = document.getElementById('form-message');
  const menu = document.getElementById('menu-toggle');
  const fmt = new Intl.NumberFormat('ru-RU');

  // Dates can't be in the past
  const today = new Date().toISOString().split('T')[0];
  issue.min = today;
  ret.min = today;

  function calculate() {
    const price = Number(item.selectedOptions[0].dataset.price || 0);
    if (!price || !issue.value || !ret.value) {
      daysText.textContent = 'Choose an item and dates to see the price.';
      total.textContent = '';
      return;
    }
    const days = Math.round((new Date(ret.value) - new Date(issue.value)) / 86400000) + 1;
    if (days < 1) {
      daysText.textContent = 'Return date must be the same day or later than the issue date.';
      total.textContent = '';
      ret.setCustomValidity('Return date must not be before the issue date.');
      return;
    }
    ret.setCustomValidity('');
    const discount = days >= 7 ? 0.2 : days >= 3 ? 0.1 : 0;
    const sum = Math.round(price * days * (1 - discount));
    daysText.textContent = days + ' day(s)' + (discount ? ', discount ' + discount * 100 + '%' : '') + ':';
    total.textContent = fmt.format(sum) + ' ₸';
  }

  [item, issue, ret].forEach(function (el) { el.addEventListener('input', calculate); });
  issue.addEventListener('change', function () { ret.min = issue.value || today; calculate(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    message.hidden = false;
    message.textContent = 'Request sent. We will call you to confirm the booking.';
    form.reset();
    calculate();
  });

  // Close the side panel after tapping a menu link
  document.querySelectorAll('#site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { menu.checked = false; });
  });
})();
