import { useForm } from "react-hook-form";
import { useCreateTask, useUpdateTask } from "../../hooks/TasksHooks/tasksHooks";
import { useParams } from "react-router-dom";

function TaskModal({ projectId, task, onClose }: any) {
  const isEdit = !!task;

  const { mutate: createTask, isPending: creating } = useCreateTask();
  const { mutate: updateTask, isPending: updating } = useUpdateTask();
  const { id } = useParams();

  const { register, handleSubmit } = useForm({
    defaultValues: task || {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    if (isEdit) {
      updateTask({
        id: task.id,
        project_id: id,
        data,
      });
    } else {
      createTask({
        ...data,
        project_id: id,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input
            placeholder="Title"
            {...register("title")}
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Description"
            {...register("description")}
            className="border p-2 rounded"
          />

          <select {...register("status")} className="border p-2 rounded">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select {...register("priority")} className="border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {creating || updating
                ? "Saving..."
                : isEdit
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;