// ==UserScript==
// @name         Endorsement Clicker
// @version      1.0
// @description  Endorse all the mods in the download history
// @author       FallenStar
// @match        https://www.nexusmods.com/*/users/myaccount?tab=download+history
// @match        https://www.nexusmods.com/users/myaccount?tab=download+history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        GM_registerMenuCommand
// @downloadURL 	https://github.com/FallenStar08/FallenUserScripts/raw/main/NexusAutoEndorse.user.js
// @updateURL 		https://github.com/FallenStar08/FallenUserScripts/raw/main/NexusAutoEndorse.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to close modals (this totally does work)
    function closeModal() {
        let modals = document.querySelectorAll('.mfp-close');
        //console.log(modals);
        modals.forEach(modal => {
            modal.click();
        });
    }

    function clickEndorsements(callback) {
        closeModal(); // Close any open modals before endorsing (which is super not needed)
        let endorseLinks = document.querySelectorAll('a.endorse-mod > svg.icon-endorse-inactive');
        let totalLinks = endorseLinks.length;
        let count = 0;

        if (totalLinks === 0 && hasNextButton()) {
            callback(); // No thingies -> next page
        } else {
            endorseLinks.forEach((svg, index) => {
                setTimeout(() => {
                    console.log("Processing link #" + index);
                    svg.parentElement.click()
                    count++;

                    // all endorsements are done or all links are processed (or where skipped)
                    if (count >= totalLinks) {
                        callback(); // -> next page
                    }
                }, index * 500); // idk it's fast enough just go get something to drink
            });
        }
    }


    function clickNextButton() {
        let nextButton = document.querySelector('.paginate_button.next');
        if (nextButton) {
            nextButton.click();
            return true;
        }
        return false;
    }

    // Function to check if next button can be clicked (== exists and isn't disabled)
    function hasNextButton() {
        let nextButton = document.querySelector('.paginate_button.next');
        return nextButton !== null && !nextButton.classList.contains('disabled');
    }

    // Function to continuously click on endorsements and paginate
    function autoEndorse() {
        clickEndorsements(function () {
            let hasNext = hasNextButton();
            if (hasNext) {
                clickNextButton();
                setTimeout(autoEndorse, 1000); // Change delay as needed
            } else {
                console.log("No more next buttons. Script stopped.");
                closeModal();
            }
        });
    }

    // Register menu command to toggle the script
    GM_registerMenuCommand("Toggle Script", autoEndorse);

})();
