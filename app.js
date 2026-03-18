(() => {
  const STORAGE_KEY = 'life-cost-hourly-wage';

  const wageInput = document.getElementById('hourly-wage');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const emptyState = document.getElementById('empty-state');

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
    const wage = parseFloat(wageInput.value);
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
    if (wageInput.value) {
      localStorage.setItem(STORAGE_KEY, wageInput.value);
    }
  }

  function loadWage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      wageInput.value = saved;
    }
  }

  // Initialize
  loadWage();

  wageInput.addEventListener('input', () => {
    saveWage();
    update();
  });

  priceInput.addEventListener('input', update);

  // Run initial calculation if wage was loaded from storage
  update();
})();
