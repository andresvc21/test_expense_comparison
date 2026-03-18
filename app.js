(() => {
  const WAGE_KEY = 'life-cost-wage';
  const WAGE_TYPE_KEY = 'life-cost-wage-type';

  const wageInput = document.getElementById('wage-input');
  const wageLabel = document.getElementById('wage-label');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const emptyState = document.getElementById('empty-state');
  const toggleBtns = document.querySelectorAll('.wage-toggle-btn');
  const slider = document.querySelector('.wage-toggle-slider');

  let wageType = 'hourly';

  function getHourlyWage() {
    const raw = parseFloat(wageInput.value);
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

  function updateLabel() {
    wageLabel.textContent = wageType === 'annual' ? 'Your annual salary' : 'Your hourly wage';
    wageInput.placeholder = wageType === 'annual' ? '50000' : '0.00';
    wageInput.step = wageType === 'annual' ? '1000' : '0.01';
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

  function setWageType(type) {
    wageType = type;
    toggleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    slider.classList.toggle('annual', type === 'annual');
    updateLabel();
    localStorage.setItem(WAGE_TYPE_KEY, type);
  }

  function saveWage() {
    if (wageInput.value) {
      localStorage.setItem(WAGE_KEY, wageInput.value);
    }
  }

  function loadWage() {
    const savedType = localStorage.getItem(WAGE_TYPE_KEY);
    if (savedType) {
      setWageType(savedType);
    }

    const saved = localStorage.getItem(WAGE_KEY);
    if (saved) {
      wageInput.value = saved;
    }
  }

  // Initialize
  loadWage();

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.type === wageType) return;
      wageInput.value = '';
      setWageType(btn.dataset.type);
      saveWage();
      update();
      wageInput.focus();
    });
  });

  wageInput.addEventListener('input', () => {
    saveWage();
    update();
  });

  priceInput.addEventListener('input', update);

  update();
})();
