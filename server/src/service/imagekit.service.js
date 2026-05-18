import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export async function uploadToImageKit(buffer){

    try {
        const response = await client.files.upload({
            file: buffer.toString("base64"),
            fileName: 'image',
        });
        return response
        
    } catch (error) {
        console.log(error)
    }

}