import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Task } from '../models/TaskModel';
import { ProjectService } from '../services/ProjectService';
import { LocalStorageRepository } from '../api/ApiService';

export default function AddTask() {
  const { storyId } = useParams<{ storyId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [estTime, setEstTime] = useState<number>(1);
  const [taskStatus, setTaskStatus] = useState<"Todo" | "Doing" | "Done">("Todo");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [storyName, setStoryName] = useState<string>("");

  const projectService = new ProjectService(new LocalStorageRepository());

  useEffect(() => {
    if (storyId) {
      (async () => {
        await projectService.setCurrentStory(storyId);
        await refreshTasks();
        const name = projectService.getStoryByName(storyId);
        setStoryName(name);
      })();
    }
  }, [storyId]);

  const handleCreateOrUpdateTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (taskName && taskDesc && taskPriority && taskStatus) {
      if (editTaskId) {
        const update = await projectService.updateTask(
          editTaskId,
          taskName,
          taskDesc,
          taskPriority,
          taskStatus,
        );
        console.log("Task updated:", update);
      } else {
        await projectService.createTask(
          taskName,
          taskDesc,
          taskPriority,
          taskStatus,
          estTime
        );
      }
      resetForm();
      refreshTasks();
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDesc("");
    setTaskPriority("Medium");
    setTaskStatus("Todo");
    setEstTime(1); 
    setEditTaskId(null);
  };

  const refreshTasks = async () => {
    const tasks = await projectService.readTasks();
    setTasks(tasks);
    console.log("Tasks refreshed:", tasks);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTaskName(task.name);
      setTaskDesc(task.description);
      setTaskPriority(task.priority);
      setTaskStatus(task.status);
      setEstTime(task.estTime);
      setEditTaskId(task.id);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await projectService.deleteTask(taskId);
    refreshTasks();
  };

  return (
    <>
      <div className="w-full m-auto justify-center items-center py-12">
        <form onSubmit={handleCreateOrUpdateTask}>
          <h1 className="text-4xl font-bold text-center text-[#2c2c2c] mb-8">Dodaj task</h1>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d]">
                    Nazwa task
                  </label>
                  <input
                    name="Name"
                    autoComplete="off"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d]">
                    Opis task
                  </label>
                  <textarea
                    name="Desc"
                    autoComplete="off"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d]">
                    Priorytet
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="w-full text-center bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="Low" className="text-center">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d]">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as "Todo" | "Doing" | "Done")}
                    className="w-full text-center bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="Todo" className="text-center">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d]">
                    EstTime
                  </label>
                  <input
                    name="EstTime"
                    type="number"
                    autoComplete="off"
                    value={estTime}
                    onChange={(e) => setEstTime(Number(e.target.value))}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mb-12"
              >
                Zatwierdź
              </button>
            </div>
            <Link
              to="/projects/:projectId/story"
              className="text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mb-12"
            >
              Powrót
            </Link>
          </div>
        </form>
      </div>
      <ul>
        <h1 className="text-4xl font-bold text-center text-[#2c2c2c] mb-8">
          Wybrany projekt: {storyName}
        </h1>
        {tasks.map((task) => (
          <li key={task.id}
            className="text-[#2c2c2c] text-4xl border-4 mb-16 p-6">
            {task.name} - {task.description} - {task.priority} - {task.status} - {task.estTime}
            <button
              onClick={() => handleEditTask(task.id)}
              className="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
              Edytuj task
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg">
              Usuń task
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
