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
    initImageList: () => void;
    initRemoveImage: () => void;
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
                            loginForm.classList.toggle('active');
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

            const currentURL = window.location.href;
            //console.log("Aktualny adres URL strony:", currentURL);
            if (currentURL.includes('/#/loginForm')) {
                uploadForm.classList.toggle('active');
            } else {
                console.log("false", currentURL);
            }
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
                        <img name="${image}" class="border-2 border-navy-strongBlue rounded-xl first:mt-0 mt-5 lg:mt-8" src="/uploads/${image}" alt="">
                    `).join('');


                    pictureWrapper.insertAdjacentHTML('beforeend', `
                    <div class="my-20 max-w-5xl mx-auto columns-1 gap-5 lg:gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
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
    },

    initImageList: () => {
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

            const pictureList = document.getElementById('pictureList');
            if (pictureList !== null) {

                console.log('data', data)
                const imagesListHTML = data.map((item: { value: any; }, index: number) => `
                    <li class="m-5 flex items-center justify-between border-b-2">
                        ${index + 1}
                        <img class="w-6 h-6" src="/uploads/${item}" alt="">
                        <p class="">${item}</p>
                        <button name="${item}" type="button" class="remove flex">
                            Usuń
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </li>
                `).join('');

                pictureList.insertAdjacentHTML('beforeend', `
                <ul class="my-1 max-w-5xl mx-auto">
                    ${imagesListHTML}
                </ul>`
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
    },

    initRemoveImage: () => {
        function deleteImage(fileName: string | HTMLElement | null) {
            fetch(`/admin/image/${fileName}`, {
              method: 'DELETE'
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Usuwanie nie powiodło się');
              }
            })
            .then(data => {
              console.log(data.message); // Wyświetlenie komunikatu zwrotnego po usunięciu zdjęcia
              // Tutaj możesz dodać dodatkową logikę po usunięciu zdjęcia, jeśli jest to konieczne
            })
            .catch(error => {
              console.error('Błąd podczas usuwania zdjęcia:', error);
            });
        
        }

        const pictureList = document.getElementById('pictureList'); 
        pictureList?.addEventListener('click', (event) => {
            console.log('pictureList', event);
            if((event.target as HTMLElement).classList.contains('remove')) {
                const chosenImageToDelate = (event.target as HTMLButtonElement).getAttribute('name');
                if(chosenImageToDelate && confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
                    deleteImage(chosenImageToDelate);
                    if(event.target) {
                        // @ts-ignore we know this element exists
                        event.target.parentNode.remove();
                    }
                    const image = document.querySelector('img[name="' + chosenImageToDelate + '"]');
                    image!.remove();
                }
            }
        });
     
    }

};

app.init();
app.initLoginForm();
app.initGallery();
app.initImageList();
app.initRemoveImage();