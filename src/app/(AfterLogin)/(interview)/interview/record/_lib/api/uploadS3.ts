import customFetcher from "@/lib/utils/customFetcher";

export const getPresignedUrl = async (videoName: string, thumbnailName: string) => {
  const { data } = await customFetcher(`/interview/presigned`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoName,
      thumbnailName,
    }),
  });

  return data;
};

export const upload = async (presignedUrl: string, blob: Blob) => {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "video/mp4",
      },
    });

    return response;
  } catch (err) {
    console.error(err);
  }
};
