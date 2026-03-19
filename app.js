(() => {
  const WAGE_KEY = 'life-cost-wage';
  const WAGE_TYPE_KEY = 'life-cost-wage-type';

  const wageInput = document.getElementById('wage-input');
  const wageToggle = document.getElementById('wage-toggle');
  const toggleBtns = wageToggle.querySelectorAll('.toggle-btn');
  const toggleIndicator = wageToggle.querySelector('.toggle-indicator');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const emptyState = document.getElementById('empty-state');

  let wageType = 'hourly';

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
    return wageType === 'annual' ? raw / 2080 : raw;
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
    const changed = resultTime.textContent !== timeStr;

    resultTime.textContent = timeStr;
    resultSentence.textContent = `This item costs you ${timeStr} of your life.`;
    resultExtra.textContent = getExtraBreakdown(result.totalHours);

    resultEl.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Pulse animation when value changes
    if (changed) {
      resultTime.classList.remove('pulse');
      void resultTime.offsetWidth; // force reflow to restart animation
      resultTime.classList.add('pulse');
    }
  }

  function saveWage() {
    localStorage.setItem(WAGE_TYPE_KEY, wageType);
    const raw = wageInput.value.replace(/,/g, '');
    if (raw) {
      localStorage.setItem(WAGE_KEY, raw);
    }
  }

  function loadWage() {
    const savedType = localStorage.getItem(WAGE_TYPE_KEY);
    if (savedType && (savedType === 'hourly' || savedType === 'annual')) {
      wageType = savedType;
      toggleBtns.forEach(btn => {
        const isActive = btn.dataset.value === wageType;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive);
      });
      toggleIndicator.classList.toggle('right', wageType === 'annual');
    }
    updatePlaceholder();

    const saved = localStorage.getItem(WAGE_KEY);
    if (saved) {
      wageInput.value = formatNumber(saved);
    }
  }

  function updatePlaceholder() {
    wageInput.placeholder = wageType === 'annual' ? '50,000' : '0.00';
  }

  // Only allow digits, dots, and commas in inputs
  function restrictInput(e) {
    const allowed = /[\d.,]/;
    if (e.key.length === 1 && !allowed.test(e.key)) {
      e.preventDefault();
    }
  }

  // Validation shake on empty fields
  function shakeEmpty() {
    [wageInput, priceInput].forEach(input => {
      if (!input.value) {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.add('shake');
        wrapper.addEventListener('animationend', () => wrapper.classList.remove('shake'), { once: true });
      }
    });
  }

  // Initialize
  loadWage();

  // Segmented control toggle
  wageToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn || btn.dataset.value === wageType) return;

    wageType = btn.dataset.value;
    toggleBtns.forEach(b => {
      const isActive = b.dataset.value === wageType;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', isActive);
    });
    toggleIndicator.classList.toggle('right', wageType === 'annual');

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

    // Auto-focus price field after user stops typing wage
    clearTimeout(wageInput._focusTimer);
    wageInput._focusTimer = setTimeout(() => {
      const raw = parseRaw(wageInput.value);
      if (!isNaN(raw) && raw > 0 && !priceInput.value) {
        priceInput.focus();
      }
    }, 1500);
  });

  priceInput.addEventListener('keydown', restrictInput);
  priceInput.addEventListener('input', () => {
    formatInput(priceInput);
    update();
  });

  // Pulse cleanup
  resultTime.addEventListener('animationend', () => {
    resultTime.classList.remove('pulse');
  });

  // Shake empty fields when tapping empty state
  emptyState.addEventListener('click', shakeEmpty);

  update();
})();
