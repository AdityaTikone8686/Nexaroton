export const CATEGORIES = [
  { id: "announcements", name: "Announcements", desc: "Updates from the Orebound team" },
  { id: "survival", name: "Survival SMP", desc: "Builds, discoveries, and chit-chat" },
  { id: "redstone", name: "Redstone & Builds", desc: "Contraptions, farms, and schematics" },
  { id: "support", name: "Support & Bugs", desc: "Something broken? Ask here" },
  { id: "suggestions", name: "Suggestions", desc: "Shape what Orebound becomes" }
];

export const PLANS = [
  { id: "stone", name: "Stone", price: 99, color: "#8a8a86", ram: "2 GB", slots: "10 players", backups: "Daily", support: "Community" },
  { id: "iron", name: "Iron", price: 199, color: "#d8d3c4", ram: "4 GB", slots: "25 players", backups: "Every 12h", support: "Email" },
  { id: "diamond", name: "Diamond", price: 349, color: "#4fd8e0", ram: "8 GB", slots: "60 players", backups: "Every 6h", support: "Priority chat", featured: true },
  { id: "netherite", name: "Netherite", price: 599, color: "#4a3b3b", ram: "16 GB", slots: "Unlimited*", backups: "Hourly", support: "Dedicated" }
];

export function planById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

export function seedThreads() {
  const now = Date.now();
  return [
    {
      id: "t1", cat: "announcements", title: "Season 4 world reset — Nov 2", author: "OreboundTeam",
      body: "The Season 4 world will launch November 2nd. Season 3 will stay downloadable for 30 days after the switch. Elytra and shulker farms from S3 will not carry over — plan accordingly!",
      created: now - 1000 * 60 * 60 * 24 * 3,
      replies: [{ author: "CobbleQueen", body: "Finally, my base needed a fresh start anyway.", created: now - 1000 * 60 * 60 * 24 * 2 }]
    },
    {
      id: "t2", cat: "survival", title: "Found a triple ancient city near spawn", author: "Deepslate_Dan",
      body: "Coordinates in the comments if a few people want to raid it together this weekend. Bring wind charges, the sculk sensors are relentless.",
      created: now - 1000 * 60 * 60 * 20,
      replies: [
        { author: "WardenBait", body: "Count me in, I've got a stack of totems ready.", created: now - 1000 * 60 * 60 * 10 },
        { author: "CobbleQueen", body: "Send coords, I'll bring a boat full of TNT minecarts.", created: now - 1000 * 60 * 60 * 4 }
      ]
    },
    {
      id: "t3", cat: "redstone", title: "6-lane item sorter — schematic inside", author: "WardenBait",
      body: "Built a compact 6-lane sorter that fits in a 9x9 footprint. Runs at full hopper speed with no double-item jams. Happy to share the schematic if people want it.",
      created: now - 1000 * 60 * 60 * 48, replies: []
    },
    {
      id: "t4", cat: "support", title: "Lag spikes every ~20 minutes on Iron plan", author: "Pebble_Pete",
      body: "Getting a half-second freeze roughly every 20 minutes, seems tied to autosave. Anyone else on Iron seeing this?",
      created: now - 1000 * 60 * 60 * 30,
      replies: [{ author: "OreboundTeam", body: "That's the world autosave — we've since moved it to a background thread, should be smoother now.", created: now - 1000 * 60 * 60 * 28 }]
    },
    {
      id: "t5", cat: "suggestions", title: "Vote: should we allow single-player-only mods client-side?", author: "CobbleQueen",
      body: "Things like minimap and inventory sorting mods, nothing that touches server logic. Curious what the community thinks.",
      created: now - 1000 * 60 * 60 * 70, replies: []
    }
  ];
}
