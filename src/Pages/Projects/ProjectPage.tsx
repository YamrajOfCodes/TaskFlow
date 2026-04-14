import { useState } from "react";
import Header from "@/components/Header";
import { useDeleteProject, useProjects } from "@/hooks/projectHooks/projectHooks";
import ProjectModal from "@/components/Modals/ProjectModal";
import ProjectCard from "@/components/Reusable/ProjectCard";
import Loader from "@/components/Reusable/Loader";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const { mutateAsync: deleteProject } = useDeleteProject();

  const [modalOpen, setModalOpen]       = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8">
      <Header />

      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl italic font-normal text-neutral-900 leading-none mb-1">
            Projects
          </h1>
          <p className="text-sm text-neutral-400">
            {projects.length} active project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5
                     text-sm font-medium text-white transition-opacity hover:opacity-80 cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          New project
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full
                            border border-dashed border-neutral-300">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm">No projects yet — create your first one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project: Project, i: number) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => deleteProject(project.id)}
                  onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          onClose={() => { setModalOpen(false); setEditingProject(null); }}
          initialData={editingProject ?? undefined}
          isEdit={!!editingProject}
        />
      )}
    </div>
  );
}