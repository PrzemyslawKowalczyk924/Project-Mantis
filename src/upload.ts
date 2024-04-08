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
            if (messageElement) {
                messageElement.innerHTML = `<p>Zdjęcie dodano pomyślnie: ${JSON.stringify(data)}</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const messageElement = document.getElementById('uploadForm');
            if (messageElement) {
                messageElement.innerHTML = `<p>Wystąpił błąd: ${error.message}</p>`;
            }
        });
    } else {
        console.error('File input or description input not found');
    }
});