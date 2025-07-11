import { storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImageToFirebase = async (fileBuffer: Buffer, fileName: string, mimetype: string): Promise<string> => {
  const storageRef = ref(storage, `avatars/${fileName}`);
  const metadata = { contentType: mimetype };
  await uploadBytes(storageRef, fileBuffer, metadata);
  const url = await getDownloadURL(storageRef);
  return url;
};
