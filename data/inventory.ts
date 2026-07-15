export type InventoryState = {
  medals: string[];
  certificates: string[];
  keys: string[];
  vocabulary: string[];
  stars: number;
};

export const defaultInventory: InventoryState = {
  medals: [],
  certificates: [],
  keys: ["Clé du Royaume"],
  vocabulary: [],
  stars: 0
};

export function loadInventory(): InventoryState {
  if (typeof window === "undefined") return defaultInventory;
  try {
    const saved = localStorage.getItem("chateau-inventory");
    return saved ? { ...defaultInventory, ...JSON.parse(saved) } : defaultInventory;
  } catch {
    return defaultInventory;
  }
}

export function saveInventory(inventory: InventoryState) {
  localStorage.setItem("chateau-inventory", JSON.stringify(inventory));
}