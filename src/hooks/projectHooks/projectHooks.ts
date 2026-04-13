import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:4000";

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

//
// ✅ CREATE PROJECT
//
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

//
// ✅ UPDATE PROJECT
//
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

//
// ✅ DELETE PROJECT
//
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
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