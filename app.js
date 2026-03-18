(() => {
  const WAGE_KEY = 'life-cost-wage';
  const WAGE_TYPE_KEY = 'life-cost-wage-type';

  const wageInput = document.getElementById('wage-input');
  const wageTypeSelect = document.getElementById('wage-type');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const emptyState = document.getElementById('empty-state');

  // Format number with thousand separators: 100000 → 100,000
  function formatNumber(value) {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // Strip commas to get raw number
  function parseRaw(str) {
    return parseFloat(str.replace(/,/g, ''));
  }

  // Format an input field with thousand separators while preserving cursor
  function formatInput(input) {
    const raw = input.value.replace(/,/g, '');
    // Allow empty, trailing dot, or trailing dot + zeros (user still typing decimals)
    if (raw === '' || raw === '.' || /\.\d*0*$/.test(raw) && raw.endsWith('0') === false) {
      // still format the integer part
    }
    // Only format if it's a valid partial number
    if (/^\d*\.?\d*$/.test(raw)) {
      const cursorPos = input.selectionStart;
      const commasBefore = (input.value.slice(0, cursorPos).match(/,/g) || []).length;
      input.value = formatNumber(raw);
      const commasAfter = (input.value.slice(0, cursorPos).match(/,/g) || []).length;
      const newPos = cursorPos + (commasAfter - commasBefore);
      input.setSelectionRange(newPos, newPos);
    }
  }

  function getHourlyWage() {
    const raw = parseRaw(wageInput.value);
    if (isNaN(raw) || raw <= 0) return NaN;
    return wageTypeSelect.value === 'annual' ? raw / 2080 : raw;
  }

  function calculate(wage, price) {
    if (!wage || wage <= 0 || price < 0) return null;
    if (price === 0) return { hours: 0, minutes: 0, totalHours: 0 };

    const totalHours = price / wage;
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    return { hours, minutes, totalHours };
  }

  function formatTime(hours, minutes) {
    const hLabel = hours === 1 ? 'hour' : 'hours';
    const mLabel = minutes === 1 ? 'minute' : 'minutes';

    if (hours === 0 && minutes === 0) return '0 minutes';
    if (hours === 0) return `${minutes} ${mLabel}`;
    if (minutes === 0) return `${hours} ${hLabel}`;
    return `${hours} ${hLabel} ${minutes} ${mLabel}`;
  }

  function getExtraBreakdown(totalHours) {
    if (totalHours < 24) return '';

    const workDays = (totalHours / 8).toFixed(1);
    const workWeeks = (totalHours / 40).toFixed(1);

    if (totalHours >= 40) {
      return `That's about ${workWeeks} work weeks (${workDays} work days).`;
    }
    return `That's about ${workDays} work days.`;
  }

  function update() {
    const wage = getHourlyWage();
    const price = parseRaw(priceInput.value);

    if (isNaN(wage) || isNaN(price) || wage <= 0) {
      resultEl.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const result = calculate(wage, price);
    if (!result) {
      resultEl.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const timeStr = formatTime(result.hours, result.minutes);
    resultTime.textContent = timeStr;
    resultSentence.textContent = `This item costs you ${timeStr} of your life.`;
    resultExtra.textContent = getExtraBreakdown(result.totalHours);

    resultEl.classList.remove('hidden');
    emptyState.classList.add('hidden');
  }

  function saveWage() {
    localStorage.setItem(WAGE_TYPE_KEY, wageTypeSelect.value);
    const raw = wageInput.value.replace(/,/g, '');
    if (raw) {
      localStorage.setItem(WAGE_KEY, raw);
    }
  }

  function loadWage() {
    const savedType = localStorage.getItem(WAGE_TYPE_KEY);
    if (savedType) {
      wageTypeSelect.value = savedType;
    }
    updatePlaceholder();

    const saved = localStorage.getItem(WAGE_KEY);
    if (saved) {
      wageInput.value = formatNumber(saved);
    }
  }

  function updatePlaceholder() {
    if (wageTypeSelect.value === 'annual') {
      wageInput.placeholder = '50,000';
    } else {
      wageInput.placeholder = '0.00';
    }
  }

  // Only allow digits, dots, and commas in inputs
  function restrictInput(e) {
    const allowed = /[\d.,]/;
    if (e.key.length === 1 && !allowed.test(e.key)) {
      e.preventDefault();
    }
  }

  // Initialize
  loadWage();

  wageTypeSelect.addEventListener('change', () => {
    wageInput.value = '';
    updatePlaceholder();
    saveWage();
    update();
    wageInput.focus();
  });

  wageInput.addEventListener('keydown', restrictInput);
  wageInput.addEventListener('input', () => {
    formatInput(wageInput);
    saveWage();
    update();
  });

  priceInput.addEventListener('keydown', restrictInput);
  priceInput.addEventListener('input', () => {
    formatInput(priceInput);
    update();
  });

  update();
})();
