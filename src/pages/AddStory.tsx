import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Story } from "../models/StoryModel";
import { ProjectService } from "../services/ProjectService";
import { LocalStorageRepository } from "../api/ApiService";
import { UserService } from "../services/UserService";
import addNotification from "react-push-notification";

export default function AddStory() {
  const { projectId } = useParams<{ projectId: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [storyName, setStoryName] = useState("");
  const [storyDesc, setStoryDesc] = useState("");
  const [storyPriority, setStoryPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [storyStatus, setStoryStatus] = useState<"Todo" | "Doing" | "Done">("Todo");
  const [editStoryId, setEditStoryId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  const navigate = useNavigate();
  const projectService = new ProjectService(new LocalStorageRepository());
  const currentUser = UserService.getUser();

  useEffect(() => {
    if (projectId) {
      projectService.setCurrentProject(projectId);
      refreshStoryList();
      const name = projectService.getProjectByName(projectId);
      setProjectName(name);
    }
  }, [projectId]);

  const handleCreateOrUpdateStory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (storyName && storyDesc && storyPriority && storyStatus) {
      if (editStoryId) {
        const updated = await projectService.updateStory(
          editStoryId,
          storyName,
          storyDesc,
          storyPriority,
          storyStatus
        );
        if (updated) {
          handleEditStoryNotification();
        }
      } else {
        await projectService.createStory(
          storyName,
          storyDesc,
          storyPriority,
          storyStatus,
          currentUser?.id || ""
        );
      }
      resetForm();
      handleAddStoryNotification();
    }
  };

  const resetForm = () => {
    setStoryName("");
    setStoryDesc("");
    setStoryPriority("Medium");
    setStoryStatus("Todo");
    setEditStoryId(null);
    refreshStoryList();
  };

  const handleEditStory = async (id: string) => {
    const story = stories.find((story) => story.id === id);
    if (story) {
      setStoryName(story.name);
      setStoryDesc(story.description);
      setStoryPriority(story.priority);
      setStoryStatus(story.status);
      setEditStoryId(story.id);
    }
  };

  const handleDeleteStory = async (id: string) => {
    const deleted = await projectService.deleteStory(id);
    if (deleted) {
      refreshStoryList();
      handleDeleteStoryNotification();
    } else {
      alert("Error");
    }
  };

  const handleOpenStory = (id: string) => {
    projectService.setCurrentStory(id);
    navigate(`/story/${id}/task`);
  };

  const refreshStoryList = async () => {
    const stories = projectService.readStories();
    setStories(stories);
    console.log("Refreshed stories: ", stories);
  };

  const handleAddStoryNotification = () => {
    addNotification({
      title: 'Utworzenie story',
      message: 'Poprawnie utworzono story!',
    });
  };

  const handleEditStoryNotification = () => {
    addNotification({
      title: "Edycja story",
      message: "Edycja przebiegła pomyślnie!"
    });
  };

  const handleDeleteStoryNotification = () => {
    addNotification({
      title: "Usunięcie story",
      message: "Poprawnie usunięto story!"
    });
  };

  // Task filter
  const todoStories = stories.filter(story => story.status === "Todo");
  const doingStories = stories.filter(story => story.status === "Doing");
  const doneStories = stories.filter(story => story.status === "Done");

  return (
    <>
      <div className="w-full m-auto justify-center items-center py-12">
        <form onSubmit={handleCreateOrUpdateStory}>
          <h1 className="text-4xl font-bold text-center text-[#2c2c2c] mb-8 dark:text-white">Dodaj Story</h1>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d] dark:text-white">
                    Nazwa story
                  </label>
                  <input
                    name="Name"
                    autoComplete="off"
                    value={storyName}
                    onChange={(e) => setStoryName(e.target.value)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d] dark:text-white">
                    Opis story
                  </label>
                  <textarea
                    name="Desc"
                    autoComplete="off"
                    value={storyDesc}
                    onChange={(e) => setStoryDesc(e.target.value)}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="leading-7 text-sm text-[#3d3d3d] dark:text-white">
                    Priorytet
                  </label>
                  <select
                    value={storyPriority}
                    onChange={(e) => setStoryPriority(e.target.value as "Low" | "Medium" | "High")}
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
                  <label className="leading-7 text-sm text-[#3d3d3d] dark:text-white">
                    Status
                  </label>
                  <select
                    value={storyStatus}
                    onChange={(e) => setStoryStatus(e.target.value as "Todo" | "Doing" | "Done")}
                    className="w-full text-center bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="Todo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="p-10 m-8 w-full">
                <button
                  type='submit'
                  className="flex mx-auto text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg "
                >
                  Zatwierdź
                </button>
              </div>
              <Link
                to="/projects"
                className="flex mx-auto text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mb-16"
              >
                Powrót
              </Link>
            </div>
          </div>
        </form>

        <h1 className="text-4xl font-bold text-center text-[#2c2c2c] mb-8 dark:text-white">
          Wybrany projekt: {projectName}
        </h1>

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 p-4">
            <h2 className="text-2xl font-bold text-center text-[#2c2c2c] mb-4 dark:text-white">
              Todo
            </h2>
            <ul>
              {todoStories.map((story) => (
                <li key={story.id} className="text-[#2c2c2c] text-4xl border-4 mb-16 p-6 dark:text-white">
                  {story.name} <br />
                  {story.description} <br />
                  {story.priority} <br />
                  {story.status} <br />
                  <button
                    onClick={() => handleOpenStory(story.id)}
                    className="flex mx-auto text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Otwórz
                  </button>
                  <button
                    onClick={() => handleEditStory(story.id)}
                    className="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg">
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/3 p-4">
            <h2 className="text-2xl font-bold text-center text-[#2c2c2c] mb-4 dark:text-white">
              Doing
            </h2>
            <ul>
              {doingStories.map((story) => (
                <li key={story.id} className="text-[#2c2c2c] text-4xl border-4 mb-16 p-6 dark:text-white">
                  {story.name} <br />
                  {story.description} <br />
                  {story.priority} <br />
                  {story.status} <br />
                  <button
                    onClick={() => handleOpenStory(story.id)}
                    className="flex mx-auto text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Otwórz
                  </button>
                  <button
                    onClick={() => handleEditStory(story.id)}
                    className="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg">
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/3 p-4">
            <h2 className="text-2xl font-bold text-center text-[#2c2c2c] mb-4 dark:text-white">
              Done
            </h2>
            <ul>
              {doneStories.map((story) => (
                <li key={story.id} className="text-[#2c2c2c] text-4xl border-4 mb-16 p-6 dark:text-white">
                  {story.name} <br />
                  {story.description} <br />
                  {story.priority} <br />
                  {story.status} <br />
                  <button
                    onClick={() => handleOpenStory(story.id)}
                    className="flex mx-auto text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Otwórz
                  </button>
                  <button
                    onClick={() => handleEditStory(story.id)}
                    className="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg">
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
