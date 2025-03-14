class SideChannel {
  constructor() {
    this.store = new Map();
  }

  // Set a value in the side channel
  set(key, value) {
    this.store.set(key, value);
  }

  // Get a value from the side channel
  get(key) {
    return this.store.get(key);
  }
}

// Example usage of the SideChannel class
const sideChannel = new SideChannel();
