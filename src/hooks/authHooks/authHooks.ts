import { BASE_URL } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axios.get(
        `${BASE_URL}/users?email=${data.email}`
      );

      const user = res.data[0];

      if (!user) {
        throw { response: { status: 401, data: { message: "Email not found" } } };
      }

      if (user.password !== data.password) {
        throw { response: { status: 401, data: { message: "Password is incorrect" } } };
      }

      const token = btoa(`${user.id}:${user.email}:${Date.now()}`);

      return { access_token: token, user };
    },

    onSuccess: (data) => {
      localStorage.setItem("login", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Login successful");

      window.location.href = "/projects";
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};


export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const check = await axios.get(
        `${BASE_URL}/users?email=${data.email}`
      );

      if (check.data.length > 0) {
        throw {
          response: {
            status: 400,
            data: { message: "User already exists" },
          },
        };
      }

      const res = await axios.post(`${BASE_URL}/users`, data);

      const token = btoa(`${res.data.id}:${res.data.email}:${Date.now()}`);

      return { access_token: token, user: res.data };
    },

    onSuccess: (data) => {
      localStorage.setItem("login", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Registered successfully");

      window.location.href = "/projects";
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Registration failed";

      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => Promise.resolve(),

    onSuccess: () => {
      localStorage.removeItem("login");
      localStorage.removeItem("user");

      queryClient.clear();

      toast.success("Logged out");

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    },
  });
};