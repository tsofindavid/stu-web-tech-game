const ITEM = {
  score: "_score",
};

class Store {
  static get(key) {
    const item = localStorage.getItem(key);

    if (item) {
      return JSON.parse(item).value;
    }

    return null;
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify({ value }));
  }

  static delete() {
    localStorage.setItem(key, JSON.stringify({ value }));
  }
}
