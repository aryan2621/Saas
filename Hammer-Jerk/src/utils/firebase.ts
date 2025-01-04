import { getBlob, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { fireStorage } from '@/config/firebase';

export const uploadDocument = async (
    file: File,
    prefix: string,
    onProgress: (progress: number) => void,
    onComplete: (url: string) => void,
) => {
    try {
        const r = ref(fireStorage, `${prefix}/${file.size}_${new Date().getTime()}`);
        const uploadTask = uploadBytesResumable(r, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                throw error;
            },
            async () => {
                const downloadURL = await getDownloadURL(r);
                onComplete(downloadURL);
            },
        );
    } catch (error) {
        console.log(`Failed to upload document: ${error}`);
        throw error;
    }
};

export const downloadDocument = async (url: string) => {
    const httpsReference = ref(fireStorage, url);
    const httpUrl = await getDownloadURL(httpsReference);
    const file = await fetch(httpUrl);
    return file.blob();
};
