export const defaultKeyBindings = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
};

export function getKeyBindings() {
  const stored = localStorage.getItem("keyBindings");
  return stored ? JSON.parse(stored) : defaultKeyBindings;
}

export function setKeyBinding(action, key) {
  const bindings = getKeyBindings();
  bindings[action] = key;
  localStorage.setItem("keyBindings", JSON.stringify(bindings));
}
