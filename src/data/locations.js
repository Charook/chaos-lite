/**
 * locations.js
 * Macro hubs, primary named sub-locations, and hub-specific theme/domain pools 
 * for Blackwood Crossing (Chaos-Lite Engine).
 */

const MACRO_LOCATIONS = {
  parish: {
    name: "Parish Complex",
    primary: [
      "Parish Chapel Sanctuary",
      "Convent Infirmary Ward",
      "Underground Scriptorium"
    ],
    themes: [
      "Incense-Heavy",
      "Candle-Gloom",
      "Sanctified",
      "Warded",
      "Crypt-Cold",
      "Echoing"
    ],
    domain: [
      "Crypt Ossuary Alcove",
      "Belltower Rafters",
      "Confessional Booth",
      "Cloister Garden Walkway",
      "Acolyte Cell",
      "Incense Storage Vault"
    ]
  },

  manor: {
    name: "Governor's Manor",
    primary: [
      "Governor's Private Study",
      "Grand Ballroom",
      "Estate Kitchen & Scullery"
    ],
    themes: [
      "Opulent",
      "Velvet-Draped",
      "Dust-Veiled",
      "Whispering-Draft",
      "Shadowed-Gilded",
      "Imposing"
    ],
    domain: [
      "Upper Guest Bedchamber",
      "Private Wine Cellar",
      "Ancestor Portrait Gallery",
      "Servant Passageway",
      "Clifftop Observation Balcony",
      "Sealed Family Crypt"
    ]
  },

  docks: {
    name: "The Docks",
    primary: [
      "Riverfront Pier Mooring",
      "Customs Cargo Warehouse",
      "Captain Finch's Office"
    ],
    themes: [
      "Silt-Choked",
      "Fog-Drenched",
      "Salt-Crusted",
      "Barnacle-Rotted",
      "Rope-Tangled",
      "Current-Swept"
    ],
    domain: [
      "Smuggler's Bilge Hold",
      "Timber Stacking Yard",
      "Mooring Pile Crawlspace",
      "Fishmonger Market Stall",
      "Damp Cargo Inspection Pit",
      "Riverbank Mudflat Cove"
    ]
  },

  mill: {
    name: "Textile Mill",
    primary: [
      "Main Loom Floor",
      "Foreman's Elevated Office",
      "Chemical Dye Vats"
    ],
    themes: [
      "Loom-Deafening",
      "Chemical-Stained",
      "Soot-Choked",
      "Steam-Scalded",
      "Grease-Slicked",
      "Lint-Choked"
    ],
    domain: [
      "Subterranean Furnace Tunnel",
      "Raw Cotton Storage Vault",
      "Mechanical Gear Assembly Room",
      "Drying Racks Loft",
      "Waste Drainage Runoff Culvert",
      "Worker Break Scullery"
    ]
  },

  inn: {
    name: "Traveler's Rest Inn",
    primary: [
      "Tavern Common Room",
      "Inn Kitchen & Pantry",
      "Martha's Private Office"
    ],
    themes: [
      "Hearth-Warmed",
      "Ale-Soaked",
      "Pipe-Smoke-Veiled",
      "Drafty",
      "Creaking",
      "Whisper-Quiet"
    ],
    domain: [
      "Upper Guest Bedchamber",
      "Ale Barrel Cellar",
      "Stable Master's Loft",
      "Private Dining Nook",
      "Shadowed Back Entryway",
      "Bard's Corner Stage"
    ]
  },

  fort: {
    name: "Fort Ironwood",
    primary: [
      "Commander's Map Room",
      "Main Courtyard Gatehouse",
      "Garrison Barracks"
    ],
    themes: [
      "Iron-Clanked",
      "Wind-Scoured",
      "Torch-Lit",
      "Grim",
      "Stark",
      "Rain-Slicked"
    ],
    domain: [
      "Subterranean Guard Cell",
      "Parapet Battlements",
      "Armory Supply Vault",
      "Watchtower Lookout Post",
      "Powder & Munitions Store",
      "Ironwood Trench Passageway"
    ]
  },

  apothecary: {
    name: "Mystic Apothecary",
    primary: [
      "Apothecary Shop Counter",
      "Alchemical Backroom Laboratory"
    ],
    themes: [
      "Herb-Pungent",
      "Sulfur-Tinged",
      "Glass-Clinking",
      "Dust-Moted",
      "Cambered-Dark",
      "Tincture-Stained"
    ],
    domain: [
      "Herb-Drying Attic Loft",
      "Root Storage Cellar",
      "Private Consultation Nook",
      "Enclosed Herbalist Garden Plot",
      "Distillation Furnace Closet"
    ]
  },

  town: {
    name: "Town at Large",
    primary: [
      "Central Market Square",
      "Old River Bridge"
    ],
    themes: [
      "Mud-Clogged",
      "Fog-Enshrouded",
      "Crowded",
      "Cobble-Uneven",
      "Rain-Pattered",
      "Shadow-Draped"
    ],
    domain: [
      "Narrow Cobblestone Alley",
      "Town Public Well",
      "Cobbler's Workshop Street",
      "Residential Cottage Parlor",
      "Overgrown Perimeter Wall",
      "Discarded Merchant Cart Corner",
      "Fog-Draped Crossroads"
    ]
  }
};

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.MACRO_LOCATIONS = MACRO_LOCATIONS;
}
