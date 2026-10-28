const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const cashForm = document.querySelector('#cash-form');
const ingredientForm = document.querySelector('#ingredient-form');
const cashMessage = document.querySelector('#cash-message');
const ingredientMessage = document.querySelector('#ingredient-message');
const cashDate = document.querySelector('#cash-date');
const cashList = document.querySelector('#cash-list');
const cashEmpty = document.querySelector('#cash-empty');
const ingredientList = document.querySelector('#ingredient-list');

let cashEntries = [];
let ingredients = [];
let editingIngredientId = null;

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function showMessage(element, message = '', isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
  element.classList.toggle('success', Boolean(message) && !isError);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || 'Não foi possível concluir a operação.');
  }
  return result;
}

function weekdayFor(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })
    .format(new Date(year, month - 1, day));
}

function updateCashPreview() {
  const formData = new FormData(cashForm);
  const received = Number(formData.get('received')) || 0;
  const withdrawal = Number(formData.get('withdrawal')) || 0;
  const delivery = Number(formData.get('delivery')) || 0;
  document.querySelector('#cash-balance').value = currency.format(received - withdrawal - delivery).replace('R$', '').trim();
  document.querySelector('#cash-weekday').value = weekdayFor(cashDate.value);
}

function resetCashForm() {
  cashForm.reset();
  document.querySelector('#cash-form-title').textContent = 'Lançamento do dia';
  cashForm.elements.received.value = '0';
  cashForm.elements.withdrawal.value = '0';
  cashForm.elements.delivery.value = '0';
  cashDate.value = localDateString();
  showMessage(cashMessage);
  updateCashPreview();
}

function updateCashSummary() {
  const todayEntry = cashEntries.find((entry) => entry.date === localDateString());
  const totalBalance = cashEntries.reduce((total, entry) => total + Number(entry.balance), 0);
  document.querySelector('#today-received').textContent = currency.format(todayEntry?.received || 0);
  document.querySelector('#today-withdrawal').textContent = currency.format(todayEntry?.withdrawal || 0);
  document.querySelector('#today-delivery').textContent = currency.format(todayEntry?.delivery || 0);
  document.querySelector('#today-balance').textContent = currency.format(totalBalance);
}

function renderCashEntries() {
  cashList.replaceChildren();
  document.querySelector('#cash-entry-count').textContent =
    `${numberFormat.format(cashEntries.length)} ${cashEntries.length === 1 ? 'lançamento' : 'lançamentos'}`;
  cashEmpty.classList.toggle('hidden', cashEntries.length > 0);

  if (!cashEntries.length) {
    return;
  }

  for (const entry of cashEntries) {
    const row = document.createElement('tr');
    const [year, month, day] = entry.date.split('-').map(Number);
    addCell(row, new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day)), 'cash-date-cell');
    addCell(row, entry.weekday, 'cash-weekday-cell');
    addCell(row, currency.format(Number(entry.received)));
    addCell(row, currency.format(Number(entry.withdrawal)));
    addCell(row, entry.withdrawalReason || '—', 'cash-reason-cell');
    addCell(row, currency.format(Number(entry.delivery)));
    addCell(row, currency.format(Number(entry.balance)), 'cash-balance-cell');
    const edit = document.createElement('button');
    edit.className = 'icon-button';
    edit.type = 'button';
    edit.dataset.editDate = entry.date;
    edit.setAttribute('aria-label', `Editar lançamento de ${entry.date}`);
    edit.textContent = '✎';
    const actions = document.createElement('td');
    actions.append(edit);
    row.append(actions);
    cashList.append(row);
  }
}

async function loadCashEntries() {
  cashEntries = await request('/api/cash');
  renderCashEntries();
  updateCashSummary();
}

cashDate.addEventListener('change', updateCashPreview);
cashForm.addEventListener('input', updateCashPreview);
cashForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage(cashMessage);
  const data = Object.fromEntries(new FormData(cashForm));
  try {
    await request(`/api/cash/${encodeURIComponent(data.date)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    await loadCashEntries();
    resetCashForm();
    showMessage(cashMessage, 'Lançamento salvo com sucesso.');
  } catch (error) {
    showMessage(cashMessage, error.message, true);
  }
});

document.querySelector('#cash-reset').addEventListener('click', resetCashForm);
cashList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-edit-date]');
  if (!button) return;
  const entry = cashEntries.find((item) => item.date === button.dataset.editDate);
  if (!entry) return;
  cashDate.value = entry.date;
  cashForm.elements.received.value = entry.received;
  cashForm.elements.withdrawal.value = entry.withdrawal;
  cashForm.elements.delivery.value = entry.delivery;
  cashForm.elements.withdrawalReason.value = entry.withdrawalReason;
  updateCashPreview();
  document.querySelector('#cash-form-title').textContent = 'Editar lançamento';
  cashForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function resetIngredientForm() {
  ingredientForm.reset();
  editingIngredientId = null;
  document.querySelector('#ingredient-form-title').textContent = 'Novo insumo';
  ingredientForm.querySelector('[type="submit"]').innerHTML = '<span aria-hidden="true">＋</span> Salvar insumo';
  showMessage(ingredientMessage);
}

function updateIngredientSummary() {
  document.querySelector('#ingredient-count').textContent = numberFormat.format(ingredients.length);
  document.querySelector('#stock-count').textContent = numberFormat.format(
    ingredients.reduce((total, item) => total + item.stockQuantity, 0)
  );
  document.querySelector('#inventory-value').textContent = currency.format(
    ingredients.reduce((total, item) => total + item.unitPrice * item.stockQuantity, 0)
  );
}

function addCell(row, text, className = '') {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) cell.className = className;
  row.append(cell);
  return cell;
}

function renderIngredients() {
  ingredientList.replaceChildren();
  document.querySelector('#ingredient-empty').classList.toggle('hidden', ingredients.length > 0);
  for (const ingredient of ingredients) {
    const row = document.createElement('tr');
    addCell(row, ingredient.name, 'ingredient-name');
    addCell(row, currency.format(ingredient.unitPrice));
    addCell(row, numberFormat.format(ingredient.stockQuantity));
    addCell(row, currency.format(ingredient.unitPrice * ingredient.stockQuantity), 'total-cell');
    const actions = document.createElement('td');
    actions.className = 'row-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'text-button';
    edit.dataset.editId = ingredient._id;
    edit.textContent = 'Editar';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'text-button delete-button';
    remove.dataset.deleteId = ingredient._id;
    remove.textContent = 'Excluir';
    actions.append(edit, remove);
    row.append(actions);
    ingredientList.append(row);
  }
  updateIngredientSummary();
}

async function loadIngredients() {
  ingredients = await request('/api/ingredients');
  renderIngredients();
}

ingredientForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage(ingredientMessage);
  const data = Object.fromEntries(new FormData(ingredientForm));
  const isEditing = Boolean(editingIngredientId);
  try {
    await request(isEditing ? `/api/ingredients/${encodeURIComponent(editingIngredientId)}` : '/api/ingredients', {
      method: isEditing ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });
    await loadIngredients();
    resetIngredientForm();
    showMessage(ingredientMessage, isEditing ? 'Insumo atualizado com sucesso.' : 'Insumo cadastrado com sucesso.');
  } catch (error) {
    showMessage(ingredientMessage, error.message, true);
  }
});

document.querySelector('#ingredient-reset').addEventListener('click', resetIngredientForm);
ingredientList.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-edit-id]');
  const deleteButton = event.target.closest('[data-delete-id]');
  if (editButton) {
    const ingredient = ingredients.find((item) => item._id === editButton.dataset.editId);
    if (!ingredient) return;
    editingIngredientId = ingredient._id;
    ingredientForm.elements.name.value = ingredient.name;
    ingredientForm.elements.unitPrice.value = ingredient.unitPrice;
    ingredientForm.elements.stockQuantity.value = ingredient.stockQuantity;
    document.querySelector('#ingredient-form-title').textContent = 'Editar insumo';
    ingredientForm.querySelector('[type="submit"]').innerHTML = 'Salvar alterações';
    ingredientForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (deleteButton) {
    const ingredient = ingredients.find((item) => item._id === deleteButton.dataset.deleteId);
    if (!ingredient || !window.confirm(`Excluir o insumo "${ingredient.name}"?`)) return;
    try {
      await request(`/api/ingredients/${encodeURIComponent(ingredient._id)}`, { method: 'DELETE' });
      await loadIngredients();
      showMessage(ingredientMessage, 'Insumo excluído com sucesso.');
    } catch (error) {
      showMessage(ingredientMessage, error.message, true);
    }
  }
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const isCash = button.dataset.tab === 'cash';
    document.querySelector('#cash-panel').classList.toggle('hidden', !isCash);
    document.querySelector('#ingredients-panel').classList.toggle('hidden', isCash);
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('active', tab === button));
    document.querySelector('#breadcrumb-current').textContent = isCash ? 'Caixa' : 'Insumos';
  });
});

async function initialize() {
  cashDate.value = localDateString();
  updateCashPreview();
  try {
    await Promise.all([loadCashEntries(), loadIngredients()]);
  } catch (error) {
    showMessage(cashMessage, `Não foi possível carregar os dados: ${error.message}`, true);
    showMessage(ingredientMessage, `Não foi possível carregar os dados: ${error.message}`, true);
  }
}

initialize();
