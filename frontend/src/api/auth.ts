import api from "./axios";

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/auth";

export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (
  data: LoginRequest
) => {
  const response = await api.post<TokenResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<User>(
    "/auth/me"
  );

  return response.data;
};