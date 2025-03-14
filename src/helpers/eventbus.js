/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/eventbus.js
 * 
 * Event bus event emitter 
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  // Subscribe to the event
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Subscribe to the event only once
  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(event, onceListener); // Delete after listening once
    };
    this.on(event, onceListener);
  }

  // Unsubscribe from event
  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== listener);
  }

  // Trigger the event
  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

export default new EventBus(); // Export as singleton
