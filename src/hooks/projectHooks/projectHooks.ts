import { BASE_URL } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const getUser = () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};


export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const user = getUser();

      const res = await axios.get(
        `${BASE_URL}/projects?owner_id=${user.id}`
      );

      return res.data;
    },
  });
};


export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const user = getUser();

      const res = await axios.post(`${BASE_URL}/projects`, {
        ...data,
        owner_id: user.id,
        created_at: new Date().toISOString(),
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },

    onError: () => {
      toast.error("Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: number;
      name?: string;
      description?: string;
    }) => {
      const res = await axios.patch(
        `${BASE_URL}/projects/${id}`,
        {
          name,
          description,
        }
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated");
    },

    onError: () => {
      toast.error("Failed to update project");
    },
  });
};


export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${BASE_URL}/projects/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },

    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};