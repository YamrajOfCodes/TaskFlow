import { useEffect, useState } from "react";
import TaskModal from "../../components/Modals/TaskModal";
import TaskCard from "../../components/Reusable/TaskCard";
import { useTasks } from "@/hooks/TasksHooks/tasksHooks";
import { useParams } from "react-router-dom";

function TaskPage({ projectId }: { projectId: string }) {
    
    const {id} = useParams();
    console.log("Project ID from URL:", id);
    const { data: tasks = [], isLoading } = useTasks(id);
    const [tasksData, setTasksData] = useState(tasks);



  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(()=>{
    const data = tasks.filter((task: any) => task.project_id === id);
    setTasksData(data);
  },[tasks])
 
  if (isLoading) return <p>Loading tasks...</p>;

  

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>

        <button
          onClick={() => {
            setSelectedTask(null);
            setOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
      </div>

      {/* Task List */}
      {tasksData?.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div className="grid gap-3">
          {tasksData?.map((task: any) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {
                setSelectedTask(task);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <TaskModal
          projectId={projectId}
          task={selectedTask}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default TaskPage;