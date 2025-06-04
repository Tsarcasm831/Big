document.addEventListener('DOMContentLoaded', () => {
    console.log("Tenets page script loaded.");

    // --- Variables for Admin Unlock ---
    let keySequence = "";
    const targetSequence = "17666";
    const maxSequenceLength = targetSequence.length;

    // --- Variables for Sanctum Unlock ---
    let sanctumSequence = "";
    const targetSanctumSequence = "1111111"; // Sequence for Inner Sanctum
    const maxSanctumSequenceLength = targetSanctumSequence.length;

    // --- Variables for Archives Unlock ---
    let archivesSequence = "";
    const targetArchivesSequence = "7777777"; // Sequence for The Archives
    const maxArchivesSequenceLength = targetArchivesSequence.length;
    const currentPageFilename = window.location.pathname.split('/').pop(); // Get current HTML filename

    // --- Event Listener for Unlock Sequences ---
    document.addEventListener('keydown', (event) => {
        // Basic check to ignore inputs in potential form fields later
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        // Also ignore if modifier keys are pressed
        if (event.metaKey || event.ctrlKey || event.altKey) {
            return;
        }

        // Append the pressed key (only if it's a single character)
        if (event.key.length === 1) {
            // Admin Sequence Tracking (Global)
            keySequence += event.key;
            if (keySequence.length > maxSequenceLength) {
                keySequence = keySequence.slice(-maxSequenceLength);
            }

            // Sanctum Sequence Tracking (Global, only '1')
            if (event.key === '1') {
                 sanctumSequence += event.key;
                 if (sanctumSequence.length > maxSanctumSequenceLength) {
                     sanctumSequence = sanctumSequence.slice(-maxSanctumSequenceLength);
                 }
            } else {
                // Reset sanctum sequence if a non-'1' key is pressed
                sanctumSequence = "";
            }

             // Archives Sequence Tracking (Only on question.html, only '7')
             if (currentPageFilename === 'question.html') {
                 if (event.key === '7') {
                    archivesSequence += event.key;
                    if (archivesSequence.length > maxArchivesSequenceLength) {
                        archivesSequence = archivesSequence.slice(-maxArchivesSequenceLength);
                    }
                } else {
                    // Reset archives sequence if a non-'7' key is pressed on question.html
                    archivesSequence = "";
                }
             } else {
                 // Reset archives sequence if not on question.html
                 archivesSequence = "";
             }


            // Check if the sequences match
            if (keySequence === targetSequence) {
                console.log("Admin sequence recognized!");
                unlockAdminLink();
                keySequence = ""; // Reset sequence after successful entry
            }
            if (sanctumSequence === targetSanctumSequence) {
                console.log("Sanctum sequence recognized!");
                unlockSanctumLink();
                sanctumSequence = ""; // Reset sequence after successful entry
            }
             if (archivesSequence === targetArchivesSequence) {
                console.log("Archives sequence recognized!");
                unlockArchivesLink();
                archivesSequence = ""; // Reset sequence after successful entry
            }

        } else {
             // Reset sanctum sequence on non-single character keys (like Shift, etc.)
             sanctumSequence = "";
             // Reset archives sequence on non-single character keys
             archivesSequence = "";
        }
    });

    // --- Function to Unlock Admin Link ---
    function unlockAdminLink() {
        const adminLinks = document.querySelectorAll('.page-tree-link.admin'); // Select all admin links on the page
        adminLinks.forEach(link => {
            if (link.classList.contains('locked')) {
                link.classList.remove('locked');
                link.href = 'admin.html'; // Set the correct href
                link.dataset.tooltip = "Enter Admin Panel"; // Set new tooltip

                const icon = link.querySelector('.page-tree-icon.locked');
                if (icon) {
                    icon.remove(); // Remove the lock icon
                }

                // Add visual feedback (temporary glow/color change)
                link.style.transition = 'color 0.3s ease, text-shadow 0.3s ease';
                link.style.color = 'var(--accent-hover)';
                link.style.textShadow = '0 0 5px var(--accent-hover)';
                 setTimeout(() => {
                     link.style.color = ''; // Revert to default link color (or active if applicable)
                     link.style.textShadow = '';
                 }, 1500); // Duration of the feedback glow

                console.log("Admin link unlocked:", link);
            } else {
                console.log("Admin link already unlocked or not found in locked state:", link);
            }
        });
        setupLinkListeners(); // Re-run listener setup after modifying links
    }

    // --- Function to Unlock Inner Sanctum Link ---
    function unlockSanctumLink() {
        const sanctumLinks = document.querySelectorAll('.page-tree-link'); // Select all links

        sanctumLinks.forEach(link => {
            // Check if the link text contains "Inner Sanctum" and it's locked
            if (link.textContent.trim().includes("Inner Sanctum") && link.classList.contains('locked')) {
                link.classList.remove('locked');
                link.href = 'inner_sanctum.html'; // Set the correct href
                link.dataset.tooltip = "Enter Inner Sanctum"; // Set new tooltip

                const icon = link.querySelector('.page-tree-icon.locked');
                if (icon) {
                    icon.remove(); // Remove the lock icon
                }

                // Add visual feedback
                link.style.transition = 'color 0.3s ease, text-shadow 0.3s ease';
                link.style.color = 'var(--accent-color)'; // Use accent color
                link.style.textShadow = '0 0 5px var(--accent-color)';
                setTimeout(() => {
                    link.style.color = ''; // Revert to default link color
                    link.style.textShadow = '';
                }, 1500);

                console.log("Inner Sanctum link unlocked:", link);
            }
        });
        setupLinkListeners(); // Re-run listener setup after modifying links
    }

    // --- Function to Unlock Archives Link ---
    function unlockArchivesLink() {
        const archivesLinks = document.querySelectorAll('.page-tree-link'); // Select all links

        archivesLinks.forEach(link => {
            // Check if the link text contains "The Archives" and it's locked
            if (link.textContent.trim().includes("The Archives") && link.classList.contains('locked')) {
                link.classList.remove('locked');
                link.href = 'archives.html'; // Set the correct href
                link.dataset.tooltip = "Enter The Archives"; // Set new tooltip

                const icon = link.querySelector('.page-tree-icon.locked');
                if (icon) {
                    icon.remove(); // Remove the lock icon
                }

                // Add visual feedback
                link.style.transition = 'color 0.3s ease, text-shadow 0.3s ease';
                link.style.color = 'var(--accent-color)'; // Use accent color
                link.style.textShadow = '0 0 5px var(--accent-color)';
                setTimeout(() => {
                    link.style.color = ''; // Revert to default link color
                    link.style.textShadow = '';
                }, 1500);

                console.log("The Archives link unlocked:", link);
            }
        });
         setupLinkListeners(); // Re-run listener setup after modifying links
    }


    // --- Existing Link Interactivity ---
    // Re-attach listeners dynamically or ensure initial setup handles updates
    function setupLinkListeners() {
         // Remove old listeners first to prevent duplicates if re-run
        document.querySelectorAll('.page-tree-link').forEach(link => {
            // Remove the specific listener if it exists
            link.removeEventListener('click', handleLinkClick);
            link.classList.remove('shake'); // Clear old state
        });

        // Add listeners based on current state
        document.querySelectorAll('.page-tree-link').forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });
        console.log("Link listeners updated."); // Log when listeners are set/reset
    }


    function handleLinkClick(event) {
         const link = event.currentTarget;
         if (link.classList.contains('locked')) {
             event.preventDefault();
             console.log(`Clicked locked link: ${link.textContent.trim()}. Access denied.`);
             link.classList.add('shake');
             // Ensure shake animation applies then removes
             link.style.animation = 'none'; // Reset animation state
             link.offsetHeight; // Trigger reflow
             link.style.animation = ''; // Re-enable animation defined in CSS
             setTimeout(() => link.classList.remove('shake'), 300);
         } else if (!link.classList.contains('active')) { // Only log navigation for non-active links
             console.log(`Navigating via link: ${link.textContent.trim()}`);
             // Allow default navigation for unlocked, non-active links
         }
    }

    // Add a temporary shake animation style for feedback (if not already present)
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style'; // Add an ID to prevent duplicates
        style.textContent = `
            .shake {
                animation: horizontal-shake 0.3s ease-in-out;
            }
            @keyframes horizontal-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-3px); }
                50% { transform: translateX(3px); }
                75% { transform: translateX(-2px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initial setup of listeners
    setupLinkListeners();

});