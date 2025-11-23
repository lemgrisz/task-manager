import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTask,
  deleteTask,
  createTask,
} from "../redux/taskSlice";
import { logout } from "../redux/authSlice";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const { isInitialized, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    status: "Pending",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [isInitialized, isAuthenticated, dispatch]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTasks(tasks);
    } else if (filter === "duedate") {
      setFilteredTasks(
        [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      );
    } else if (filter === "status") {
      setFilteredTasks(
        [...tasks].sort((a, b) => {
          const statusOrder = {
            pending: 0,
            "in progress": 1,
            completed: 2,
          };

          return statusOrder[a.status] - statusOrder[b.status];
        })
      );
    }
  }, [filter, tasks]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleCreateTask = () => {
    setNewTask({
      title: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
    setSelectedTask(null);
    setIsEditMode(true);
  };

  const handleDeleteClick = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setSelectedTask(null);
      dispatch(deleteTask(taskId));
    }
  };

  const handleSaveTask = () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Task saved");
      setIsEditMode(false);
      if (selectedTask) {
        console.log(selectedTask);
        dispatch(updateTask(selectedTask));
      } else {
        console.log(newTask);
        dispatch(createTask(newTask));
      }
      setIsEditMode(false);
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!newTask.title && !selectedTask?.title)
      errors.title = "Title is required.";
    if (!newTask.dueDate && !selectedTask?.dueDate)
      errors.dueDate = "Due Date is required.";
    if (!newTask.status && !selectedTask?.status)
      errors.status = "Status is required.";
    if (!newTask.description && !selectedTask?.description)
      errors.description = "Description is required.";
    const validStatuses = ["Completed", "Pending", "In Progress"];
    if (
      (newTask.status && !validStatuses.includes(newTask.status)) ||
      (selectedTask?.status && !validStatuses.includes(selectedTask.status))
    ) {
      errors.status = "Valid statuses: Pending, In Progress, Completed.";
    }

    return errors;
  };
  const handleCancelClick = () => {
    setIsEditMode(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedTask) {
      setSelectedTask((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewTask((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-w-screen min-h-screen font-mono flex flex-col bg-[#514B96]">
      <div
        id="header"
        className="h-10 sm:h-16 bg-[#514B96] text-white flex items-center justify-between px-4 sm:px-6"
      >
        <h1 className="text-3xl">Task Manager</h1>
        <button onClick={handleLogout} className="text-2xl">
          <MdLogout />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row flex-1">
        <div
          id="sidebar"
          className="w-full h-48 sm:h-screen sm:w-96 bg-[#514B96] text-white p-4 flex flex-col"
        
        >
          <div className="flex flex-row items-center justify-between mb-4">
            <span>Your Tasks</span>
            <select
              className="bg-[#8a80f0a1] text-white p-2 rounded w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="duedate">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div
            className="flex-1 h-full overflow-y-auto"
          >
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`p-2 mb-2 rounded cursor-pointer flex flex-row justify-between items-center ${
                  selectedTask?._id === task._id
                    ? "bg-[#F47458]"
                    : "bg-[#8a80f0a1]"
                }`}
                onClick={() => {
                  setSelectedTask(task);
                  setIsEditMode(false);
                }}
              >
                <span className="w-70%]">

                {task.title}
                </span>
                <span className="w-70%]">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          id="maincontent"
          className="flex-1 bg-[#e6ecff] p-6 border rounded-xl  mt-4 sm:mt-0"
        >
          <div className="my-2 border-b-2 border-[#e0dbda] flex justify-between items-center">
            <h1 className="text-xl sm:text-3xl w-[70%] sm:w-[85%] hidden sm:block flex-wrap text-wrap">Welcome to your Dashboard {user.name}!</h1>
            <button
              onClick={handleCreateTask}
              className="rounded-xl text-md sm:text-xl bg-[#F47458] text-white w-auto sm:w-auto flex flex-row justify-center items-center gap-1 p-2 my-1"
            >
              <span>Add Task</span> <IoMdAddCircleOutline />
            </button>
          </div>
          {isEditMode ? (
            <div className="task-details">
              <input
                className="w-full text-2xl font-bold mb-4 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 focus:outline-none"
                type="text"
                name="title"
                placeholder={selectedTask ? "" : "Add Task Title Here..."}
                value={selectedTask ? selectedTask.title : newTask.title}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs">{formErrors.title}</p>
              )}

              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-2 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 min-w-md sm:w-[40%]">
                  <strong>Due Date:</strong>{" "}
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      selectedTask
                        ? selectedTask.dueDate.slice(0, 10)
                        : newTask.dueDate
                    }
                    onChange={handleInputChange}
                    className="focus:outline-none"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="mb-2 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 min-w-md sm:w-[40%]">
                  <strong>Status: </strong>
                  <input
                    type="text"
                    name="status"
                    value={selectedTask ? selectedTask.status : newTask.status}
                    onChange={handleInputChange}
                    className="focus:outline-none"
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between">
                <div className="w-full sm:w-[40%]">
                  {formErrors.dueDate && (
                    <p className="text-red-500 text-xs">{formErrors.dueDate}</p>
                  )}
                </div>
                <div className="w-full sm:w-[40%]">
                  {formErrors.status && (
                    <p className="text-red-500 text-xs">{formErrors.status}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <strong>Description</strong>
                <textarea
                  name="description"
                  value={
                    selectedTask
                      ? selectedTask.description
                      : newTask.description
                  }
                  onChange={handleInputChange}
                  className="w-full my-4 p-5 border-[#F47458] rounded-lg bg-white focus:outline-none h-40"
                  disabled={!isEditMode}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-around">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSaveTask}
                      className="bg-[#F47458] text-white px-4 p-2 rounded-xl w-28"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-[#A3AED0] text-white px-4 p-2 rounded-xl w-28"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-[#A3AED0] text-white px-4 p-2 rounded-xl w-28"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ) : selectedTask ? (
            <div className="task-details">
              <h2 className="text-2xl font-bold mb-4 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5">
                {selectedTask.title}
              </h2>
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-2 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 min-w-md sm:w-[40%]">
                  <strong>Due Date:</strong>{" "}
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </div>
                <div className="mb-2 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 min-w-md sm:w-[40%]">
                  <strong>Status:</strong> {selectedTask.status || "N/A"}
                </div>
              </div>
              <div className="my-6">
                <strong>Description</strong>
                <div className="my-4 border-spacing-2 border-[#F47458] rounded-lg bg-white p-5 h-40">
                  {selectedTask.description || "No description provided."}
                </div>
              </div>
              <div className="flex justify-around">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[#F47458] text-white px-4 p-2 rounded-xl w-28"
                >
                  Edit
                </button>
                <button
                  className="bg-[#A3AED0] text-white px-4 p-2 rounded-xl w-28"
                  onClick={() => handleDeleteClick(selectedTask._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[50%] flex justify-center items-center">
              <p className="text-gray-500">
                Select a task to view its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
