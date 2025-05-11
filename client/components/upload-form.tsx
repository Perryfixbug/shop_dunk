// components/MultiUploadForm.tsx
import { useState } from 'react';

export default function MultiUploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [urls, setUrls] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const res = await fetch('http://localhost:4001/api/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUrls(data.urls);
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      <button onClick={handleUpload}>Upload ảnh</button>
        <div>
            {urls.map((url, idx) => (
            <img key={idx} src={url} alt={`Uploaded ${idx}`} width={150} />
            ))}
        </div>
    </div>
  );
}
