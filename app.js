(() => {
  const WAGE_KEY = 'life-cost-wage';
  const WAGE_TYPE_KEY = 'life-cost-wage-type';
  const LEGACY_KEY = 'life-cost-hourly-wage';

  const wageInput = document.getElementById('wage-input');
  const wageLabel = document.getElementById('wage-label');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const emptyState = document.getElementById('empty-state');
  const radioHourly = document.getElementById('wage-hourly');
  const radioAnnual = document.getElementById('wage-annual');

  function getWageType() {
    return radioAnnual.checked ? 'annual' : 'hourly';
  }

  function getHourlyWage() {
    const raw = parseFloat(wageInput.value);
    if (isNaN(raw) || raw <= 0) return NaN;
    return getWageType() === 'annual' ? raw / 2080 : raw;
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

  function updateLabel() {
    const type = getWageType();
    wageLabel.textContent = type === 'annual' ? 'Your annual salary' : 'Your hourly wage';
    wageInput.placeholder = type === 'annual' ? '50,000' : '0.00';
    wageInput.step = type === 'annual' ? '1000' : '0.01';
  }

  function update() {
    const wage = getHourlyWage();
    const price = parseFloat(priceInput.value);

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
    const type = getWageType();
    localStorage.setItem(WAGE_TYPE_KEY, type);
    if (wageInput.value) {
      localStorage.setItem(WAGE_KEY, wageInput.value);
    }
  }

  function loadWage() {
    const savedType = localStorage.getItem(WAGE_TYPE_KEY);
    if (savedType === 'annual') {
      radioAnnual.checked = true;
    } else {
      radioHourly.checked = true;
    }
    updateLabel();

    const saved = localStorage.getItem(WAGE_KEY);
    if (saved) {
      wageInput.value = saved;
    } else {
      // Migrate from legacy key
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        wageInput.value = legacy;
      }
    }
  }

  // Initialize
  loadWage();

  radioHourly.addEventListener('change', () => {
    wageInput.value = '';
    updateLabel();
    saveWage();
    update();
    wageInput.focus();
  });

  radioAnnual.addEventListener('change', () => {
    wageInput.value = '';
    updateLabel();
    saveWage();
    update();
    wageInput.focus();
  });

  wageInput.addEventListener('input', () => {
    saveWage();
    update();
  });

  priceInput.addEventListener('input', update);

  update();
})();
