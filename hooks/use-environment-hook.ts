'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

const token = localStorage.getItem('token')

interface AddEnvironmentSchema {
    environment: string;
    stack: string;
    config: {}
}

export const useCreateEnvironment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: AddEnvironmentSchema) => {
            const configObject = values.config.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
              }, {} as Record<string, string>);
        
              const payload = {
                ...values,
                config: configObject, // Send config as an object instead of an array
              };
          const response = await axios.post(
            "/environment", 
            payload, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["allEnvironments"],
          });
        },
      });
  };

  export function useGetEnvironments() {
    return useQuery({
      queryKey: ["allEnvironments"],
      queryFn: async () => {
        const response = await axios.get(`/environment/`);
        return response.data;
      },
    });
  }

  export function useGetEnvironmentTypes() {
    return useQuery({
      queryKey: ["allEnvironmentType"],
      queryFn: async () => {
        const response = await axios.get(`/environment/type`);
        return response.data;
      },
    });
  }

  export const useDestroyEnvironment = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (name: string) => {
        const response = await axios.delete(`/environment/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allEnvironments"],
        });
      },
    });
  };