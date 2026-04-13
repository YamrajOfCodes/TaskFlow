// import { useDeleteTask } from "@/hooks/useTasks";

function TaskCard({ task, onEdit }: any) {
//   const { mutate: deleteTask } = useDeleteTask();

  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>

        <div className="text-xs mt-1">
          <span>Status: {task.status}</span> |{" "}
          <span>Priority: {task.priority}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>

        <button
          onClick={() =>
            // deleteTask({ id: task.id, project_id: task.project_id })
            ""
          }
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;