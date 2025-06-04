// factions-aliens.js
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var aliensPopupContainer = document.getElementById('aliens-popup-container');
    var aliensPopupClose = document.getElementById('aliens-popup-close');
    var aliensGridContainer = document.getElementById('aliens-races-grid');

    // Expanded aliens data
    var aliensData = {
        anthromorph: {
            localSrc: 'assets/anthromorphs_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/anthromorphs.webp',
            name: "Anthromorph",
            description: "Humanoid species with animal-like traits and features.",
            extendedDescription: "Anthromorphs blend human intelligence with animal instincts, adapting seamlessly to harsh environments.",
            history: "Emerging from ancient genetic experiments, Anthromorphs have a rich cultural heritage deeply connected to nature.",
            abilities: "Enhanced senses, agility, and adaptive survival skills.",
            culture: "Tribal and nature-centric, with deep rituals and communal bonds.",
            modelName: "anthromorph",
            stats: { STR: 70, DEX: 80, AGI: 90, VIT: 60, COM: 30, INT: 50, PER: 100, CHA: 40, PSY: 20 }
        },
        avianos: {
            localSrc: 'assets/avianos_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/avianos.webp',
            name: "Avianos",
            description: "Avian-like beings with wings and lightweight skeletal structure.",
            extendedDescription: "Avianos soar over ancient ruins, their keen eyes scanning the horizon for signs of life and danger.",
            history: "First observed in the aftermath of environmental collapse, they adapted quickly to airborne living.",
            abilities: "Flight, enhanced vision, and aerial agility.",
            culture: "Often solitary yet forming small flocks during migration seasons.",
            modelName: "avianos",
            stats: { STR: 40, DEX: 90, AGI: 100, VIT: 50, COM: 30, INT: 60, PER: 120, CHA: 50, PSY: 40 }
        },
        behemoth: {
            localSrc: 'assets/Behemoth_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/Behemoth.webp',
            name: "Behemoth",
            description: "Massive, physically imposing species with incredible strength.",
            extendedDescription: "Behemoths are living fortresses, their colossal frames towering over most other species.",
            history: "Evolved in high-gravity environments, their bodies adapted to withstand extreme physical pressure.",
            abilities: "Superhuman strength, natural armor, and resistance to environmental hazards.",
            culture: "Honor-bound society with complex familial structures and generational knowledge.",
            modelName: "behemoth",
            stats: { STR: 120, DEX: 40, AGI: 30, VIT: 110, COM: 20, INT: 50, PER: 60, CHA: 40, PSY: 30 }
        },
        chiropteran: {
            localSrc: 'assets/Chiropteran_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/chiropteran.webp',
            name: "Chiropteran",
            description: "Bat-like species with echolocation abilities.",
            extendedDescription: "Chiropterans navigate the dark with precision, using their echolocation to map out the unseen.",
            history: "Having evolved in perpetual darkness, they are masters of nocturnal survival.",
            abilities: "Silent flight, echolocation, and agile maneuvering.",
            culture: "They form close-knit colonies in hidden caverns, governed by a complex social hierarchy.",
            modelName: "chiropteran",
            stats: { STR: 60, DEX: 80, AGI: 100, VIT: 70, COM: 20, INT: 40, PER: 110, CHA: 30, PSY: 50 }
        },
        dengar: {
            localSrc: 'assets/dengar_charger_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/dengar.webp',
            name: "Dengar",
            description: "Reptilian species with enhanced senses and tribal society.",
            extendedDescription: "Dengars are known for their relentless charge and formidable presence in combat.",
            history: "Hailing from harsh, arid lands, they evolved to thrive in the most challenging environments.",
            abilities: "Powerful charge, natural armor, and acute sensory perception.",
            culture: "Their society is built on honor, strength, and deep-rooted traditions of combat.",
            modelName: "dengar",
            stats: { STR: 150, DEX: 30, AGI: 40, VIT: 180, COM: 10, INT: 40, PER: 50, CHA: 20, PSY: 30 }
        },
        kilrathi: {
            localSrc: 'assets/kilrathi.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/kilrathi.png',
            name: "Kilrathi",
            description: "Feline predatory species with a strong warrior culture.",
            extendedDescription: "Kilrathi exude a fierce aura, their combat prowess and agility making them deadly hunters.",
            history: "Tracing their lineage to ancient feline ancestors, Kilrathi have always ruled with a mix of grace and brutality.",
            abilities: "Speed, agility, and razor-sharp instincts in battle.",
            culture: "They adhere to a strict code of honor and loyalty, forming tight clans led by the strongest warriors.",
            modelName: "kilrathi",
            stats: { STR: 90, DEX: 100, AGI: 110, VIT: 80, COM: 40, INT: 60, PER: 100, CHA: 50, PSY: 30 }
        },
        shalRahPrime: {
            localSrc: 'assets/shalrah prime_nobg.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/shalRahPrime.webp',
            name: "Shal'Rah Prime",
            description: "Ancient species with psychic abilities and advanced technology.",
            extendedDescription: "Shal'Rah Prime combines the mystique of ancient wisdom with the power of advanced, almost forgotten technology.",
            history: "Their origins are shrouded in mystery, with legends pointing to a civilization lost to time.",
            abilities: "Psychic powers, technological integration, and strategic foresight.",
            culture: "A secretive society that values knowledge and the preservation of ancient lore.",
            modelName: "shalRahPrime",
            stats: { STR: 50, DEX: 60, AGI: 70, VIT: 60, COM: 40, INT: 120, PER: 100, CHA: 80, PSY: 150 }
        },
        talEhn: {
            localSrc: 'assets/talehn.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/talEhn.webp',
            name: "Tal'Ehn",
            description: "Insectoid hive-based species with collective intelligence.",
            extendedDescription: "Tal'Ehn operate with a hive mind, their individual roles merging into a collective strategy.",
            history: "Evolving from a primitive communal structure, they have grown into a species defined by unity and shared purpose.",
            abilities: "Collective strategy, rapid adaptation, and intricate communication.",
            culture: "Their society is driven by the hive, with each member contributing to the greater good.",
            modelName: "talEhn",
            stats: { STR: 40, DEX: 60, AGI: 50, VIT: 70, COM: 20, INT: 150, PER: 80, CHA: 70, PSY: 200 }
        },
        talorian: {
            localSrc: 'assets/talorian.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/talorian.webp',
            name: "Talorian",
            description: "Silicon-based lifeforms with crystalline physiology.",
            extendedDescription: "Talorians possess a crystalline structure that not only defines their physical appearance but also their unique way of interacting with energy.",
            history: "Born from the remnants of ancient, silicon-rich planets, they embody resilience and adaptability.",
            abilities: "Energy manipulation, crystal regeneration, and thermal resistance.",
            culture: "Their culture revolves around the pursuit of knowledge and the harmonious integration of technology and nature.",
            modelName: "talorian",
            stats: { STR: 50, DEX: 70, AGI: 80, VIT: 60, COM: 100, INT: 90, PER: 60, CHA: 120, PSY: 40 }
        },
        tanaRhe: {
            localSrc: 'assets/tanarhe.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/tanaRhe.webp',
            name: "T'ana'Rhe",
            description: "Energy-based entities capable of possessing material bodies.",
            extendedDescription: "T'ana'Rhe are enigmatic beings that can traverse the boundaries between energy and matter, often serving as mediators.",
            history: "Legends say they emerged from the cosmic void, bearing the wisdom of the stars.",
            abilities: "Energy manipulation, possession, and temporal perception.",
            culture: "They follow a philosophy of balance, seeking harmony between the material and the ethereal.",
            modelName: "tanaRhe",
            stats: { STR: 20, DEX: 30, AGI: 50, VIT: 70, COM: 40, INT: 90, PER: 100, CHA: 70, PSY: 150 }
        },
        vyraxus: {
            localSrc: 'assets/vyraxus_nobg.png',
            remoteSrc: 'https://via.placeholder.com/512',
            name: "Vyraxus",
            description: "Amphibious species with regenerative abilities.",
            extendedDescription: "Vyraxus thrive in watery realms, their regenerative capabilities making them nearly indestructible.",
            history: "Their evolution in toxic swamps has endowed them with unmatched adaptability and resilience.",
            abilities: "Rapid regeneration, resistance to toxins, and amphibious agility.",
            culture: "They maintain a culture of survival and adaptation, often isolated in their aquatic habitats.",
            modelName: "vyraxus",
            stats: { STR: 70, DEX: 50, AGI: 60, VIT: 150, COM: 20, INT: 40, PER: 50, CHA: 10, PSY: 30 }
        },
        xithrian: {
            localSrc: 'assets/xithrian.png',
            remoteSrc: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/xithrian.webp',
            name: "Xithrian",
            description: "Highly intelligent species with tentacle-like appendages.",
            extendedDescription: "Xithrians are masters of adaptation, using their shapeshifting abilities to blend seamlessly into their surroundings.",
            history: "Their mysterious origins and elusive nature have made them the subject of many legends and studies.",
            abilities: "Shapeshifting, stealth, and high adaptability.",
            culture: "Secretive and enigmatic, they value knowledge and the art of survival above all else.",
            modelName: "xithrian",
            stats: { STR: 40, DEX: 100, AGI: 110, VIT: 50, COM: 30, INT: 80, PER: 90, CHA: 70, PSY: 60 }
        }
    };

    // Show the aliens popup when the aliens faction button is clicked
    function handleAliensFactionButtonClick() {
        var aliensButton = document.querySelector('.faction-button[data-faction="aliens"]');
        if (aliensButton) {
            aliensButton.addEventListener('click', function() {
                setTimeout(displayAliensPopup, 50);
            });
        }
    }
    handleAliensFactionButtonClick();

    // Display the aliens popup and populate its grid
    function displayAliensPopup() {
        aliensPopupContainer.style.display = 'block';
        populateAliensGrid();
    }

    // Populate the aliens grid with cards for each alien race
    function populateAliensGrid() {
        aliensGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in aliensData) {
            if (aliensData.hasOwnProperty(key)) {
                var alien = aliensData[key];
                // Use localSrc if available, otherwise fall back to remoteSrc
                var imageSrc = alien.localSrc ? alien.localSrc : alien.remoteSrc;
                
                var alienElement = document.createElement('div');
                alienElement.className = 'alien-race-item';
                alienElement.innerHTML = `
                    <img src="${imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Aliens/default_alien.png'" 
                         alt="${alien.name}" 
                         class="alien-race-icon">
                    <div class="alien-race-name">${alien.name}</div>
                    <div class="alien-race-description">${alien.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        AlienDetails.displayAlienDetails(currentKey, aliensData, aliensPopupContainer);
                    });
                })(key);
                
                alienElement.appendChild(detailsButton);
                aliensGridContainer.appendChild(alienElement);
            }
        }
    }

    // Initialize the alien details functionality
    if (typeof AlienDetails !== 'undefined') {
        AlienDetails.initAlienDetails(aliensData, aliensPopupContainer);
    } else {
        console.error('AlienDetails module not loaded');
    }

    // Close the aliens popup when its close button is clicked
    aliensPopupClose.addEventListener('click', function() {
        aliensPopupContainer.style.display = 'none';
    });

    // Clicking outside of the aliens popup container will close it
    document.addEventListener('click', function(e) {
        if (aliensPopupContainer.style.display === 'block' &&
            !aliensPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="aliens"]')) {
            aliensPopupContainer.style.display = 'none';
        }
    });
});
