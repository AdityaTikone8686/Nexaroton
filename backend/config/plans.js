export const PLANS = {
  stone: {
    id: "stone",
    name: "Stone",
    price: 40
  },

  iron: {
    id: "iron",
    name: "Iron",
    price: 80
  },

  diamond: {
    id: "diamond",
    name: "Diamond",
    price: 199
  },

  netherite: {
    id: "netherite",
    name: "Netherite",
    price: 299
  }
};

export function getPlan(planId) {
  return PLANS[planId] || null;
}
