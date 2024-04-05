import './index.css';
import 'flowbite';
//import tailwindcss from 'tailwindcss'

// navigation

import { select, classNames } from './settings.js';

interface App {
    hamburgerDropDownMenu: HTMLElement | undefined;
    hamburgerButton: HTMLElement | undefined;
    pages: HTMLElement[];
    navLinks: NodeListOf<HTMLAnchorElement> | undefined;
    privacyPolicyLinks: NodeListOf<HTMLAnchorElement> | undefined;
    initPages: () => void;
    activatePage: (pageId: string) => void;
    init: () => void;
    isLoggedIn: boolean;
    initLoginForm: () => void;
    initGallery: () => void;
}

export const app: App = {
    pages: [],
    navLinks: undefined,
    hamburgerButton: undefined,
    privacyPolicyLinks: undefined,
    isLoggedIn: false,
    hamburgerDropDownMenu: undefined,

    initPages: function () {
        const thisApp = this;

        const container = document.querySelector(select.containerOf.pages);
        if (container !== null) {
            thisApp.pages = Array.from(container.children).map(child => child as HTMLElement);
        } else {
            console.log("child");
        }

        thisApp.navLinks = document.querySelectorAll(select.nav.links);
        thisApp.privacyPolicyLinks = document.querySelectorAll(select.privacyPolicy.modalAndFootHref);


        const idFromHash = window.location.hash.replace('#/', '');

        console.log(window.innerWidth);

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

        const hamburgerButton = document.getElementById('hamburgerButton') as HTMLElement;
        const hamburgerDropDownMenu = document.getElementById('navigationLinks') as HTMLElement;

        hamburgerButton.addEventListener('click', () => {
            hamburgerDropDownMenu.classList.toggle('hidden');
        });

        for (let link of thisApp.privacyPolicyLinks) {
            link.addEventListener('click', function (event: MouseEvent): void {
                const clickedPrivacyLink = this;
                event.preventDefault();

                if (clickedPrivacyLink !== null) {

                    const id = clickedPrivacyLink.getAttribute('href')?.replace('#', '') ?? '';

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

    initLoginForm: function () {

        const loginForm = document.getElementById('loginForm') as HTMLFormElement;
        const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;

        const login = document.getElementById('login') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData();
            console.log('formData', formData);

            if (login.value && password.value) {
                formData.append('login', login.value);
                formData.append('password', password.value);

                fetch('/admin/login', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Upload failed');
                        }
                    })
                    .then(data => {
                        const messageElement = document.getElementById('message');
                        if (messageElement) {
                            messageElement.innerHTML = `<p>Upload successful. Server response: ${JSON.stringify(data)}</p>`;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        const messageElement = document.getElementById('message');
                        if (messageElement) {
                            messageElement.innerHTML = `<p>Error occurred: ${error.message}</p>`;
                        }
                    });
            }

            uploadForm.style.display = 'block';
        });

    },

    initGallery: () => {

        fetch('/image')
            .then(response => {
                if (response.ok) {
                    //respone text????
                    return response.json();
                } else {
                    throw new Error('Upload failed');
                }
            })
            .then(data => {

                const pictureWrapper = document.getElementById('pictureWrapper');
                if (pictureWrapper !== null) {

                    console.log('data', data)
                    const imagesHTML = data.map((image: { value: any; }) => `
                        <div class="border-2 border-navy-strongBlue rounded-xl h-fit">
                            <img class="h-auto max-w-full rounded-lg" src="/uploads/${image}" alt="">
                        </div>
                    `).join('');


                    pictureWrapper.insertAdjacentHTML('beforeend', `
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto my-28 grid-flow-row">
                        ${imagesHTML}
                    </div>`
                    )

                }
            })
            .catch(error => {
                console.error('Error:', error);
                const messageElement = document.getElementById('message');
                if (messageElement) {
                    messageElement.innerHTML = `<p>Error occurred: ${error.message}</p>`;
                }
            });
    }

};

app.init();
app.initLoginForm();
app.initGallery();

/* <div class="border-2 border-navy-strongBlue rounded-xl h-fit">
    <img class="h-auto max-w-full rounded-lg" src="/uploads/${data[1]}" alt="">
</div>
<div class="border-2 border-navy-strongBlue rounded-xl h-fit">
    <img class="h-auto max-w-full rounded-lg" src="/uploads/${data[2]}" alt="">
</div> */