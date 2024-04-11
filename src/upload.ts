document.getElementById('uploadForm')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;

    if (fileInput && descriptionInput) {
        formData.append('file', fileInput.files![0]);
        formData.append('description', descriptionInput.value);

        fetch('/admin/image', {
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
                const messageElement = document.getElementById('uploadForm');

                const pictureList = document.querySelector('#pictureList ul');
                if (pictureList !== null) {

                    console.log('data from upload', data)
                    pictureList.insertAdjacentHTML('beforeend', `<li class="m-5 flex items-center justify-between border-b-2">
                    <span class="font-light italic">New</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        <title>${data.fileName}</title>
                    </svg>
                    <p class="">${data.fileName}</p>
                    <button name="${data.fileName}" type="button" class="remove flex">
                        Usuń
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </li>
                `)
                };

                //setTimeout(() =>
                if (messageElement) {
                    messageElement.insertAdjacentHTML('beforeend',
                        `<p id="successMessage">Zdjęcie dodano pomyślnie: ${JSON.stringify(data)}</p>`
                    );

                    setTimeout(() => {
                        const message = document.getElementById('successMessage');
                        if (message) {
                            message.remove();
                        }
                    }, 3000);

                    const pictureWrapperDiv = document.querySelector('#pictureWrapper div');
                    console.log(pictureWrapperDiv);
                    if (pictureWrapperDiv !== null) {

                        console.log('data', data)
                        pictureWrapperDiv.insertAdjacentHTML('beforeend', `
                    <img class="border-2 border-navy-strongBlue rounded-xl first:mt-0 mt-5 lg:mt-8" src="/uploads/${data.fileName}" alt="">
                `)};
            }})
            .catch(error => {
                console.error('Error:', error);
                const messageElement = document.getElementById('uploadForm');
                if (messageElement) {
                    messageElement.insertAdjacentHTML('beforeend',
                        `<p id="failureMessage">Wystąpił błąd: ${error.message}</p>`
                    );
                }

                setTimeout(() => {
                    const message = document.getElementById('failureMessage');
                    if (message) {
                        message.remove();
                    }
                }, 3000);
            });
    } else {
        console.error('File input or description input not found');
    }
});

document.getElementById('fileInput')?.addEventListener('change', () => {
    console.log('File input or description input');
    const pictureView = document.getElementById('pcitureViewer');
    (pictureView!.innerHTML as String) = `
    <div class="flex flex-col items-center justify-center pt-5 pb-6 min-w-64 max-w-64">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="mb-2 text-sm  dark:text-gray-400">
            <span class="font-semibold">Załadowano pomyślnie</span>
        </p>
    </div>
    `;
});