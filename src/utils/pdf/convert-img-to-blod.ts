export const convertImageToBase64 = async (imagePath: string): Promise<string> => {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
};
