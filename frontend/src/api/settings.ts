import api from "./axios";

export const saveApiKey = async (
  apiKey: string
) => {
  const response = await api.post(
    "/settings/api-key",
    {
      api_key: apiKey,
    }
  );

  return response.data;
};