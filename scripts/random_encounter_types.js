// Random Encounter Types
// These encounters will despawn after 2 hours of being spawned

// Use window object to make it globally accessible
window.EncounterTypes = (function() {

const ENCOUNTER_TYPES = {
    // Combat Encounters
    "AMBUSH": {
        type: "combat",
        name: "Ambush!",
        description: "Raiders spring a trap, attacking from hidden positions and forcing a fight-or-flight response.",
        color: "#FF3333", // Bright red
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "MUTANT_FRENZY": {
        type: "combat",
        name: "Mutant Frenzy",
        description: "A wounded mutant enters a berserk state, growing stronger and more aggressive with every attack it takes.",
        color: "#8B0000", // Dark red
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "HIVE_EXECUTION": {
        type: "combat",
        name: "H.I.V.E. Execution Squad",
        description: "A squad of elite H.I.V.E. soldiers is executing prisoners. The party can intervene or stay hidden.",
        color: "#FFCC00", // Gold
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "CROSS_RETRIEVAL": {
        type: "combat",
        name: "CROSS Retrieval Team",
        description: "A heavily armed CROSS squad arrives, demanding an artifact the party has—or believes they have. Negotiation is possible, but resistance is fatal.",
        color: "#1A75FF", // Bright blue
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "HUNTED_FOR_SPORT": {
        type: "combat",
        name: "Hunted for Sport",
        description: "A Prometheus machine or Shal'Rah commando has been tracking the party for some time. It finally moves in for the kill.",
        color: "#9933CC", // Purple
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "BURIED_THREAT": {
        type: "combat",
        name: "The Buried Threat",
        description: "Something isn't quite dead beneath the ruins—a buried mech, a mutant nest, or a dormant AI-controlled turret—until the party steps too close.",
        color: "#663300", // Brown
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "CANNIBAL_FEAST": {
        type: "combat",
        name: "Cannibal Feast",
        description: "A tribe of wasteland cannibals spots the party and decides fresh meat is back on the menu.",
        color: "#CC0066", // Magenta
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "PSYKER_ROGUE": {
        type: "combat",
        name: "Psyker Gone Rogue",
        description: "A powerful psion has lost control of their mind and lashes out indiscriminately with raw psychic energy.",
        color: "#FF66FF", // Pink
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "NIGHTMARE_FOG": {
        type: "combat",
        name: "Nightmare Fog",
        description: "A strange mist causes the party to see each other as threats. Failing a willpower check results in them attacking their own allies.",
        color: "#666699", // Slate blue
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "RED_RIBBON": {
        type: "combat",
        name: "Red-Ribbon Resurgence",
        description: "A fallen FDG soldier reanimates, their synthetic infection complete. More may follow if not stopped immediately.",
        color: "#CC0000", // Dark red
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "WARLORD_TOLL": {
        type: "combat",
        name: "Warlord's Toll",
        description: "A heavily armed local warlord demands an outrageous tribute. The price is everything the party owns—or a brutal fight to the death.",
        color: "#996633", // Bronze
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "NIGHTCRAWLER_SWARM": {
        type: "combat",
        name: "Swarm of Nightcrawlers",
        description: "A wave of insect-like creatures skitter from the ruins, attacking in overwhelming numbers.",
        color: "#336600", // Dark green
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "CORRUPTED_PSION": {
        type: "combat",
        name: "The Corrupted Psion",
        description: "A once-powerful psychic has been completely overtaken by Shal'Rah mind-control. They view the party as pawns to be assimilated or destroyed.",
        color: "#660066", // Deep purple
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },

    // Non-Combat Encounters (which might turn into combat)
    "TOPDOWN_AREA": {
        type: "non-combat",
        name: "Abandoned Settlement",
        description: "A small settlement appears to be abandoned. Exploring it might yield valuable resources, but dangers could be lurking within.",
        color: "#9966CC", // Purple
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "LOST_TRAVELER": {
        type: "non-combat",
        name: "Lost Traveler (Bait?)",
        description: "A wounded survivor begs for help. Could be legit, or they're luring the party into a trap.",
        color: "#00CC66", // Green
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "STRANGE_ARTIFACT": {
        type: "non-combat",
        name: "Strange Artifact",
        description: "A glowing object hums with energy. Touching it could offer insight into a lost technology… or trigger something lethal.",
        color: "#00FFFF", // Cyan
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "DERELICT_MECH": {
        type: "non-combat",
        name: "Derelict Mech",
        description: "A rusting combat mech stands motionless. It might be salvageable, but it's unclear whether its pilot is still inside… or if it's waiting to reactivate.",
        color: "#999999", // Gray
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "NOMAD_CARAVAN": {
        type: "non-combat",
        name: "Nomad Caravan",
        description: "A traveling band of traders might be friendly. Or they might be scouting for a raider crew and marking the party for later.",
        color: "#FF9933", // Orange
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "DISTRESS_BEACON": {
        type: "non-combat",
        name: "Distress Beacon",
        description: "A repeating signal draws the party to a crashed pod or abandoned outpost. Something else may have heard it too.",
        color: "#FFFF00", // Yellow
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "CROSS_RECON": {
        type: "non-combat",
        name: "CROSS Recon Unit",
        description: "A lone CROSS soldier observes the party but does not attack. They may be studying them… or just waiting for the right moment.",
        color: "#3399FF", // Light blue
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    },
    "HOLOGRAPHIC_ECHO": {
        type: "non-combat",
        name: "Holographic Echo",
        description: "A pre-invasion recording flickers to life, showing the last moments of a doomed city. The real question is—why did it activate now?",
        color: "#00CCCC", // Teal
        duration: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    }
};

// Helper function to get a random encounter type
function getRandomEncounterType() {
    const types = Object.keys(ENCOUNTER_TYPES);
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
}

// Helper function to get random combat encounter
function getRandomCombatEncounter() {
    const combatTypes = Object.keys(ENCOUNTER_TYPES).filter(key => 
        ENCOUNTER_TYPES[key].type === "combat"
    );
    const randomIndex = Math.floor(Math.random() * combatTypes.length);
    return combatTypes[randomIndex];
}

// Helper function to get random non-combat encounter
function getRandomNonCombatEncounter() {
    const nonCombatTypes = Object.keys(ENCOUNTER_TYPES).filter(key => 
        ENCOUNTER_TYPES[key].type === "non-combat"
    );
    const randomIndex = Math.floor(Math.random() * nonCombatTypes.length);
    return nonCombatTypes[randomIndex];
}

// Return the public API
return {
    ENCOUNTER_TYPES,
    getRandomEncounterType,
    getRandomCombatEncounter,
    getRandomNonCombatEncounter
};

})(); // End of IIFE