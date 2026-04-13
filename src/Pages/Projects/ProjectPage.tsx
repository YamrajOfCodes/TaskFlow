import { useState } from "react";
import { useDeleteProject, useProjects, useUpdateProject } from "@/hooks/projectHooks/projectHooks";
import ProjectModal from "@/components/Modals/ProjectModal";
import ProjectCard from "@/components/Reusable/ProjectCard";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const { data: projects } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = (id: number) => {
    deleteProject(id);
  };

const handleEdit = (project: Project) => {
  setEditingProject(project);
  setModalOpen(true);
};

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + New Project
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects?.map((project: Project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          onClose={() => {
            setModalOpen(false);
            setEditingProject(null);
          }}
          initialData={editingProject || undefined}
          isEdit={!!editingProject}
        />
      )}
    </div>
  );
}