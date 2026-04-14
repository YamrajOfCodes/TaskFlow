import { BASE_URL } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useTasks = (projectId?: string) => {
    console.log(projectId, "Project ID in useTasks hook");
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/tasks`
      );
      return res.data;
    },
    enabled: !!projectId,
  });
};


export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      project_id: string;
    }) => {
      const res = await axios.post(`${BASE_URL}/tasks`, {
        ...data,
        status: data.status || "todo",
        priority: data.priority || "medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return res.data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.project_id],
      });
      toast.success("Task created");
    },

    onError: () => {
      toast.error("Failed to create task");
    },
  });
};


export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      project_id,
      data,
    }: {
      id: string;
      project_id: string;
      data: Partial<{
        title: string;
        description: string;
        status: string;
        priority: string;
      }>;
    }) => {
      const res = await axios.patch(
        `${BASE_URL}/tasks/${id}`,
        {
          ...data,
          updated_at: new Date().toISOString(),
        }
      );

      return { updatedTask: res.data, project_id };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", data.project_id],
      });
      toast.success("Task updated");
    },

    onError: () => {
      toast.error("Failed to update task");
    },
  });
};


export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      project_id,
    }: {
      id: string;
      project_id: string;
    }) => {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      return project_id;
    },

    onSuccess: (project_id) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", project_id],
      });
      toast.success("Task deleted");
    },

    onError: () => {
      toast.error("Failed to delete task");
    },
  });
};