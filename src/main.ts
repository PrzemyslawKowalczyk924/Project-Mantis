import './index.css'
//import tailwindcss from 'tailwindcss'

// navigation

import { select, classNames } from './settings.js';

interface App {
    pages: HTMLElement[];
    navLinks: NodeListOf<HTMLAnchorElement> | undefined;
    hamburgerLinks: NodeListOf<HTMLAnchorElement> | undefined;
    privacyPolicyLinks: NodeListOf<HTMLAnchorElement> | undefined;
    initPages: () => void;
    activatePage: (pageId: string) => void;
    init: () => void;
}

export const app: App = {
    pages: [],
    navLinks: undefined,
    hamburgerLinks: undefined,
    privacyPolicyLinks: undefined,

    initPages: function () {
        const thisApp = this;

        const container = document.querySelector(select.containerOf.pages);
        if (container !== null) {
            thisApp.pages = Array.from(container.children).map(child => child as HTMLElement);
        } else {
            // Obsługa przypadku, gdy nie można znaleźć kontenera
            console.log("child");
        }

        thisApp.navLinks = document.querySelectorAll(select.nav.links);
        thisApp.hamburgerLinks = document.querySelectorAll(select.nav.hamburgerLinks);
        thisApp.privacyPolicyLinks = document.querySelectorAll(select.privacyPolicy.modalAndFootHref);


        const idFromHash = window.location.hash.replace('#/', '');

        /* const url = window.location.href;

        if (!url.includes('https')) {
            window.location.href = 'https://www.mantis-ma.pl';
        } */

        let pageMatchingHash = thisApp.pages[0].id;

        for (let page of thisApp.pages) {
            if (page.id == idFromHash) {
                pageMatchingHash = page.id;
                break;
            }
        }

        thisApp.activatePage(pageMatchingHash);

        for (let link of thisApp.navLinks) {
            link.addEventListener('click', function (event) {
                const clickedElement = this;
                event.preventDefault();

                // Sprawdzenie, czy clickedElement nie jest null
                if (clickedElement !== null) {
                    /* get page id from href attribute */
                    const id = clickedElement.getAttribute('href')?.replace('#', '') ?? '';

                    /* run thisApp.activePage  with that id */
                    window.location.hash = '#/' + id;

                    thisApp.activatePage(id);
                }
            });
        }

        for (let link of thisApp.hamburgerLinks) {
            link.addEventListener('click', function (event) {
                const clickedHambElement = this;
                event.preventDefault();

                if (clickedHambElement !== null) {
                    /* get page id from href attribute */
                    const id = clickedHambElement.getAttribute('href')?.replace('#', '') ?? '';

                    /* run thisApp.activePage  with that id */
                    window.location.hash = '#/' + id;
                    thisApp.activatePage(id);

                    const hamburgerDropDown = document.getElementById('hamburgerDropDown');
                    if (hamburgerDropDown !== null) {
                        hamburgerDropDown.style.display = 'none';
                    }
                }
            });
        }

        for (let link of thisApp.privacyPolicyLinks) {
            link.addEventListener('click', function (event: MouseEvent): void {
                const clickedPrivacyLink = this;
                event.preventDefault();

                if (clickedPrivacyLink !== null) {

                    const id = clickedPrivacyLink.getAttribute('href')?.replace('#', '')?? '';
    
                    window.location.hash = '#/' + id;
                    thisApp.activatePage(id);
                }
            });
        }
    },

    activatePage: function (pageId) {
        const thisApp = this;
    
        if (thisApp.navLinks !== undefined) {
            /* add class 'active' to matching pages, remove from non-matching */
            for (let page of thisApp.pages) {
                page.classList.toggle(classNames.pages.active, page.id == pageId);
            }
    
            /* add class 'active' to matching links, remove from non-matching */
            for (let link of thisApp.navLinks) {
                link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
            }
        } else {
            console.error("navLinks is undefined!");
        }
    },

    init: function () {
        const thisApp = this;

        thisApp.initPages();
    },

};

app.init();

