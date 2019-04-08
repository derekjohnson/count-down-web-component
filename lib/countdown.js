class Countdown extends HTMLElement {
  static get observedAttributes() {
    return ['ends', 'breakpoint1', 'breakpoint2'];
  }

  constructor() {
    super();
    this.initialiseClock = this.initialiseClock.bind(this);
    this.attachShadow({
      mode: 'open',
    });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue !== oldValue) {
      this[attrName] = newValue;
      if (attrName !== 'ends') {
        this.render();
      }
    }
  }

  render() {
    const { shadowRoot, ends, breakpoint1, breakpoint2, template } = this;
    const templateNode = document.getElementById(template);
    shadowRoot.innerHTML = '';
    if (templateNode) {
      const content = document.importNode(templateNode.content, true);
      shadowRoot.appendChild(content);
    } else {
      shadowRoot.innerHTML = `<style>
        time {
          display: grid;
        }

        @media screen and (min-width:${breakpoint1}) {
          time {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media screen and (min-width:${breakpoint2}) {
          time {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .number, .unit {
          display: block;
        }

        .number {
          font-size: var(--countdown-number-font-size);
        }

        .unit {
          font-size: var(--countdown-unit-font-size);
        }
      </style>

      <slot name="heading"></slot>
      <time></time>`;
    }
    this.initialiseClock(ends);
  }

  get ends() {
    return this.getAttribute('ends');
  }

  get breakpoint1() {
    return this.getAttribute('breakpoint1');
  }

  get breakpoint2() {
    return this.getAttribute('breakpoint2');
  }

  get template() {
    return this.getAttribute('template');
  }

  set ends(value) {
    this.setAttribute('ends', value);
    this.initialiseClock(value);
  }

  set breakpoint1(value) {
    this.setAttribute('breakpoint1', value);
  }

  set breakpoint2(value) {
    this.setAttribute('breakpoint2', value);
  }

  set template(value) {
    this.setAttribute('template', value);
  }

  // Build a countdown unit
  _createCountdownItem(key, value) {
    const countdownItem = document.createElement('span');
    countdownItem.className = 'item';
    /* actual time left in days, hours, minutes or seconds */
    const timeLeft = document.createElement('span');
    timeLeft.className = `number ${key}`;
    timeLeft.textContent = value;
    /* days, hours, minutes or seconds */
    const unit = document.createElement('span');
    unit.className = 'unit';
    unit.textContent = key;
    countdownItem.appendChild(timeLeft);
    countdownItem.appendChild(unit);
    return countdownItem;
  }

  // Calcuate days, hours, minutes and seconds until endTime
  _getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  // Setup and run the clock in the DOM
  initialiseClock(endDate) {
    const { shadowRoot, _createCountdownItem, _getTimeRemaining } = this;
    const timeRemaining = _getTimeRemaining(endDate);
    const timeUnits = Object.keys(timeRemaining);
    const clock = shadowRoot.querySelector('time');
    let timeInterval;
    clock.innerHTML = '';
    timeUnits.forEach((timeUnit) => {
      if (timeUnit !== 'total') {
        clock.appendChild(_createCountdownItem(timeUnit, timeRemaining[timeUnit]));
      }
    });

    function updateClock(ref) {
      const endValue = ref.ends;
      const updatedTimeRemaining = _getTimeRemaining(endValue);

      const daysEl = shadowRoot.querySelector('.days');
      const hoursEl = shadowRoot.querySelector('.hours');
      const minutesEl = shadowRoot.querySelector('.minutes');
      const secondsEl = shadowRoot.querySelector('.seconds');

      daysEl.textContent = updatedTimeRemaining.days;
      hoursEl.textContent = updatedTimeRemaining.hours;
      minutesEl.textContent = updatedTimeRemaining.minutes;
      secondsEl.textContent = updatedTimeRemaining.seconds;

      /* Update the datetime attribute of the time element */
      clock.setAttribute('datetime', `P${updatedTimeRemaining.days}DT${updatedTimeRemaining.hours}H${updatedTimeRemaining.minutes}M${updatedTimeRemaining.seconds}S`);

      if (updatedTimeRemaining.total <= 0) {
        clearInterval(timeInterval);
      }
    }

    function doesClockExist(ref) {
      if (shadowRoot.querySelector('.days') === null) {
        window.requestAnimationFrame(doesClockExist);
      } else {
        updateClock(ref);
        timeInterval = setInterval(() => {
          updateClock(ref);
        }, 1000);
      }
    }

    doesClockExist(this);
  }
}

customElements.define('count-down', Countdown);
