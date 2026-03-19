(() => {
  const WAGE_KEY = 'life-cost-wage';
  const WAGE_TYPE_KEY = 'life-cost-wage-type';

  const TIME_EXAMPLES = [
    // Minutes (0.05–0.25h)
    { activity: "listen to a song", hours: 0.06 },
    { activity: "brew a cup of coffee", hours: 0.08 },
    { activity: "do a quick stretch", hours: 0.08 },
    { activity: "check your email", hours: 0.1 },
    { activity: "send a few texts", hours: 0.1 },
    { activity: "water your plants", hours: 0.1 },
    { activity: "eat a snack", hours: 0.12 },
    { activity: "watch a YouTube short", hours: 0.05 },
    { activity: "pet your dog", hours: 0.08 },
    { activity: "do 20 push-ups", hours: 0.07 },

    // Under 1h (0.25–1h)
    { activity: "take a walk around the block", hours: 0.33 },
    { activity: "watch a sitcom episode", hours: 0.4 },
    { activity: "meditate", hours: 0.33 },
    { activity: "do a crossword puzzle", hours: 0.5 },
    { activity: "call a friend", hours: 0.5 },
    { activity: "take a power nap", hours: 0.33 },
    { activity: "read a book chapter", hours: 0.5 },
    { activity: "go for a jog", hours: 0.5 },
    { activity: "write in your journal", hours: 0.33 },
    { activity: "tidy up your desk", hours: 0.25 },
    { activity: "practice a card trick", hours: 0.5 },
    { activity: "do a quick yoga session", hours: 0.75 },

    // 1–3h
    { activity: "watch a movie", hours: 2 },
    { activity: "cook a nice meal from scratch", hours: 1.5 },
    { activity: "go to the gym", hours: 1.5 },
    { activity: "visit a museum", hours: 2 },
    { activity: "take a long bike ride", hours: 1.5 },
    { activity: "have brunch with friends", hours: 2 },
    { activity: "explore a farmers market", hours: 1 },
    { activity: "play a board game night", hours: 2.5 },
    { activity: "take a pottery class", hours: 2 },
    { activity: "go bowling", hours: 1.5 },
    { activity: "bake a batch of cookies", hours: 1.5 },
    { activity: "go to a comedy show", hours: 2 },
    { activity: "have a picnic in the park", hours: 2 },
    { activity: "learn to make sushi", hours: 2.5 },
    { activity: "play a round of mini golf", hours: 1 },

    // 3–8h
    { activity: "binge a short TV series", hours: 5 },
    { activity: "hike a mountain trail", hours: 5 },
    { activity: "deep clean your entire home", hours: 4 },
    { activity: "attend a live concert", hours: 4 },
    { activity: "spend a day at the beach", hours: 6 },
    { activity: "take a cooking workshop", hours: 4 },
    { activity: "go on a fishing trip", hours: 5 },
    { activity: "build a Lego set", hours: 4 },
    { activity: "play a video game campaign", hours: 6 },
    { activity: "explore a new neighborhood", hours: 3.5 },
    { activity: "volunteer at a food bank", hours: 4 },
    { activity: "go to an amusement park", hours: 7 },
    { activity: "attend a full-day workshop", hours: 7 },
    { activity: "have a spa day", hours: 5 },
    { activity: "reorganize your closet", hours: 4 },

    // 1–3 days (8–24h)
    { activity: "read a novel cover to cover", hours: 10 },
    { activity: "take a day trip to a nearby city", hours: 12 },
    { activity: "complete an online course module", hours: 10 },
    { activity: "reorganize an entire room", hours: 12 },
    { activity: "binge an entire TV season", hours: 10 },
    { activity: "drive cross-state", hours: 16 },
    { activity: "assemble and arrange new furniture", hours: 12 },
    { activity: "learn to play a few songs on ukulele", hours: 15 },
    { activity: "do a weekend camping trip", hours: 20 },
    { activity: "paint a watercolor series", hours: 15 },
    { activity: "build a personal website", hours: 16 },
    { activity: "deep dive into a new hobby", hours: 12 },
    { activity: "host a dinner party from scratch", hours: 10 },
    { activity: "attend a weekend workshop", hours: 16 },
    { activity: "write a short story", hours: 15 },

    // 3–7 days (24–56h)
    { activity: "take a short vacation", hours: 40 },
    { activity: "learn basic guitar chords", hours: 30 },
    { activity: "paint a room in your house", hours: 24 },
    { activity: "build a bookshelf from scratch", hours: 30 },
    { activity: "complete a short online course", hours: 30 },
    { activity: "train for and run a 5K", hours: 35 },
    { activity: "knit a scarf", hours: 25 },
    { activity: "learn the basics of photography", hours: 30 },
    { activity: "plan and go on a road trip", hours: 40 },
    { activity: "build a garden bed and plant it", hours: 25 },
    { activity: "learn to cook 10 new recipes", hours: 30 },
    { activity: "write and record a song", hours: 35 },

    // 1–4 weeks (56–160h)
    { activity: "road trip across the country", hours: 80 },
    { activity: "complete a professional certification", hours: 120 },
    { activity: "train for a 10K race", hours: 60 },
    { activity: "learn to surf", hours: 80 },
    { activity: "build a piece of furniture", hours: 80 },
    { activity: "read 10 classic novels", hours: 100 },
    { activity: "learn the basics of a new language", hours: 100 },
    { activity: "renovate a bathroom", hours: 80 },
    { activity: "complete a 200-hour yoga training", hours: 200 },
    { activity: "write a screenplay draft", hours: 120 },

    // 1–6 months (160–1000h)
    { activity: "learn conversational Spanish", hours: 300 },
    { activity: "write a short novel", hours: 250 },
    { activity: "build a piece of fine furniture", hours: 200 },
    { activity: "train for a marathon", hours: 350 },
    { activity: "learn to play piano at an intermediate level", hours: 400 },
    { activity: "develop and launch a mobile app", hours: 500 },
    { activity: "complete a semester of college courses", hours: 450 },
    { activity: "restore a vintage bicycle", hours: 200 },

    // 6+ months (1000h+)
    { activity: "backpack through Europe", hours: 1500 },
    { activity: "earn a professional certificate", hours: 1000 },
    { activity: "master a musical instrument", hours: 2000 },
    { activity: "become fluent in a new language", hours: 1200 },
    { activity: "write and publish a full novel", hours: 1500 },
    { activity: "build a tiny house", hours: 2000 },
  ];

  const wageInput = document.getElementById('wage-input');
  const wageToggle = document.getElementById('wage-toggle');
  const toggleBtns = wageToggle.querySelectorAll('.toggle-btn');
  const toggleIndicator = wageToggle.querySelector('.toggle-indicator');
  const priceInput = document.getElementById('item-price');
  const resultEl = document.getElementById('result');
  const resultTime = document.getElementById('result-time');
  const resultSentence = document.getElementById('result-sentence');
  const resultExtra = document.getElementById('result-extra');
  const resultExample = document.getElementById('result-example');
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

  function getTimeExample(totalHours) {
    if (totalHours < 0.02) return null;

    const logTarget = Math.log(totalHours);
    let minDist = Infinity;

    for (const ex of TIME_EXAMPLES) {
      const dist = Math.abs(Math.log(ex.hours) - logTarget);
      if (dist < minDist) minDist = dist;
    }

    const threshold = Math.max(minDist * 1.5, 0.5);
    const pool = TIME_EXAMPLES.filter(
      ex => Math.abs(Math.log(ex.hours) - logTarget) <= threshold
    );

    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
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

    // Pulse animation and new example when value changes
    if (changed) {
      resultTime.classList.remove('pulse');
      void resultTime.offsetWidth; // force reflow to restart animation
      resultTime.classList.add('pulse');

      const example = getTimeExample(result.totalHours);
      resultExample.textContent = example
        ? `You could ${example.activity} in that time.`
        : '';
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
