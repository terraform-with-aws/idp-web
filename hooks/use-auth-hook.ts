import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type LoginSchema = {
  email: string;
  password: string;
}

type SignupSchema = {
    name: string;
    email: string;
    password: string;
  }


export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SignupSchema) => {
      const response = await axios.post("/auth/signup", values);
      return response.data;
    },

  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      const response = await axios.post("/auth/signin", values);
      return response.data;
    },

  });
};

export function useGetLoggedInUser() {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      const response = await axios.get(`/auth/me`);
      return response.data;
    },
  });
}
