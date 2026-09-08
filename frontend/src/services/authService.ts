import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  LogoutResponse,
} from "../types/auth";

const TOKEN_KEY = "auth_token";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", credentials);

  const token = response.data.data.token;

  localStorage.setItem(TOKEN_KEY, token);

  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>("/me");

  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>("/logout");

    return response.data;
  } finally {
    clearAuth();
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

