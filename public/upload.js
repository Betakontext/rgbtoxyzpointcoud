document.getElementById('fileInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/JPEG', 'image/JPG'];
    const maxSizeInBytes = 3 * 1024 * 1024; // 3 MB

    if (file && validFileTypes.includes(file.type) && file.size <= maxSizeInBytes) {
        const formData = new FormData();
        formData.append('image', file);

        // Function to store image locally
        async function storeImageLocally(file) {
            const folder = navigator.onLine ? "/lists" : "/Bilder";
            const filePath = `${folder}/${file.name}`;
            // Implementation to store file to the local file system
        }

        // Function to upload image to Supabase
        async function uploadImageToSupabase(file) {
            try {
                const supabaseUrl = 'https://unkpdsecvopwhxjodmag.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcHVibGljLy01MjA4OTExNDI2MjM0NzI5ODk4XzEyMS5qcGciLCJpYXQiOjE3MzgyMjY1OTMsImV4cCI6MTc0MDgxODU5M30.vnGpdBpbw0pynqU0WsKmzCglENLF7_EVUCKsh1LK7Q8';
                const { createClient } = window.supabase;
                const supabase = createClient(supabaseUrl, supabaseKey);

                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(`public/${file.name}`, file);

                if (error) throw error;

                const { signedURL, error: signedUrlError } = await supabase.storage
                    .from('images')
                    .createSignedUrl(`public/${file.name}`, 60 * 60); // URL expires in 1 hour

                if (signedUrlError) throw signedUrlError;

                console.log('Image uploaded to Supabase:', data);
                return signedURL;
            } catch (e) {
                console.error('Error uploading image to Supabase:', e);
            }
        }

        try {
            let fileUrl;
            if (navigator.onLine) {
                fileUrl = await uploadImageToSupabase(file);
            } else {
                await storeImageLocally(file);
                fileUrl = `/${navigator.onLine ? "lists" : "Bilder"}/${file.name}`;
            }

            document.getElementById('loading').style.display = 'none';
            document.getElementById('message').innerText = 'Upload successful.';

            processImage(fileUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('message').innerText = 'Error uploading file.';
        }
        document.getElementById('loading').style.display = 'block';
    } else {
        alert('Please upload a valid JPEG image within 3 MB.');
    }
});
