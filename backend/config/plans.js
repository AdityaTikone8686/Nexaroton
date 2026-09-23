export const PLANS = {
  stone: {
    id: "stone",
    name: "Stone",
    price: 99
  },

  iron: {
    id: "iron",
    name: "Iron",
    price: 199
  },

  diamond: {
    id: "diamond",
    name: "Diamond",
    price: 349
  },

  netherite: {
    id: "netherite",
    name: "Netherite",
    price: 599
  }
};

export function getPlan(planId) {
  return PLANS[planId] || null;
}