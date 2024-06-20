import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Story } from "../models/StoryModel";
import { ProjectService } from "../services/ProjectService";
import { LocalStorageRepository } from "../api/ApiService";
import { UserService } from "../services/UserService";

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
  const currentUser = UserService.getUser()

  useEffect(() => {
    if (projectId) {
      projectService.setCurrentProject(projectId)
      refreshStoryList()
      const name = projectService.getProjectByName(projectId)
      setProjectName(name)
    }
  }, [projectId])

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
        console.log("Story nadpisane ", updated);
      } else {
        await projectService.createStory(
          storyName,
          storyDesc,
          storyPriority,
          storyStatus,
          currentUser?.id || ""
        );
      }
      setStoryName("");
      setStoryDesc("");
      setStoryPriority("Medium");
      setStoryStatus("Todo");
      setEditStoryId(null);
      refreshStoryList();
    }
  };

  const handleEditStory = async (id: string) => {
    const story = stories.find((story) => story.id === id);
    if (story) {
      setStoryName(story.name);
      setStoryDesc(story.description);
      setStoryPriority(story.priority);
      setStoryStatus(story.status);
      setEditStoryId(story.id ?? "");
    }
  };

  const handleDeleteStory = async (id: string) => {
    const deleted = await projectService.deleteStory(id);
    if (deleted) {
      refreshStoryList();
    } else {
      alert("Error");
    }
  };

  const handleOpenStory = (id: string) => {
    projectService.setCurrentStory(id);
    navigate(`/story/${id}/task`);
  };

  const refreshStoryList = async () => {
    const stories = projectService.readStories()
    setStories(stories)
    console.log("Odświeżono story: ", stories);
  };

  return (
    <div>
      <h2>Project: {projectName}</h2>
      <form onSubmit={handleCreateOrUpdateStory}>
        <label>
          Story Name:
          <input
            type="text"
            value={storyName}
            onChange={(e) => setStoryName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={storyDesc}
            onChange={(e) => setStoryDesc(e.target.value)}
          />
        </label>
        <label>
          Priority:
          <select
            value={storyPriority}
            onChange={(e) => setStoryPriority(e.target.value as "Low" | "Medium" | "High")}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <label>
          Status:
          <select
            value={storyStatus}
            onChange={(e) => setStoryStatus(e.target.value as "Todo" | "Doing" | "Done")}
          >
            <option value="Todo">Todo</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </label>
        <button type="submit">{editStoryId ? "Update Story" : "Add Story"}</button>
      </form>

      <h2>Stories</h2>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <div>
              <strong>{story.name}</strong> - {story.description}
            </div>
            <div>Priority: {story.priority}</div>
            <div>Status: {story.status}</div>
            <div>
              <button onClick={() => handleEditStory(story.id)}>Edit</button>
              <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
              <button onClick={() => handleOpenStory(story.id)}>Open</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
