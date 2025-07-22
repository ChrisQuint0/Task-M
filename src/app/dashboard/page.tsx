"use client";

import { Button } from "@/components/ui/button";
import { tasks } from "./tasks";

export default function Dashboard() {
  const getColorClasses = (status: string) => {
    switch (status) {
      case "todo":
        return "border-gray-500 peer-checked:bg-gray-500";
        break;
      case "in-progress":
        return "border-yellow-400 peer-checked:bg-yellow-400";
        break;
      case "done":
        return "border-green-500 peer-checked:bg-green-500";
        break;
      default:
        return "";
    }
  };
  return (
    <div>
      <div className="flex justify-end mr-5 mt-12">
        <Button className="rounded-md cursor-pointer">
          <img className="h-6" src="../icons/add_task_icon.svg"></img> Add Task
        </Button>
      </div>
      <div className="ticket-bar"></div>

      <div className="overflow-x-auto flex gap-4 px-5 pb-5 -mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="receipt-card bg-[#FFFDF6] border border-[#CCCCCC] relative h-[517px] w-[251px] flex-shrink-0 shadow-md mt-10"
          >
            <div
              id="editButtonArea"
              className="flex mb-0 justify-end mr-2 mt-2"
            >
              <Button className="h-8 w-8 rounded-full cursor-pointer relative">
                {" "}
                <img
                  className="absolute h-4"
                  src="../icons/edit_task_icon.svg"
                  alt=""
                ></img>
              </Button>
            </div>

            {/* Title */}
            <div id="taskTitle" className="font-semibold text-2xl mx-5 mt-2">
              {task.title}
            </div>

            {/* Description */}
            <div
              id="taskDescription"
              className="text-sm mx-5 mt-2 line-clamp-6"
            >
              {task.description}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-4 mt-5 mx-5 absolute top-[270px]">
              {["todo", "in-progress", "done"].map((status) => (
                <div key={status}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`status-${task.id}`}
                      value={status}
                      defaultChecked={task.status === status}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${getColorClasses(
                        status
                      )}`}
                    ></div>
                    <span className="text-lg capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            {/* Footer */}

            <div className="flex mx-5 w-55 items-center justify-between absolute top-[430px]">
              <div className="flex flex-col">
                <div>Created: {task.created_at}</div>
                <div>Updated: {task.updated_at}</div>
              </div>

              <button className="flex bg-none hover:bg-gray-200 active:bg-gray-100 h-10 w-10 justify-center items-center rounded-full cursor-pointer">
                <img
                  src="../icons/delete_task_icon.svg"
                  alt=""
                  className="h-7 w-7"
                />
              </button>
            </div>

            {/* Decorative Receipt Lines */}
            <svg
              className="absolute bottom-0 left-0 w-full h-4"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            ></svg>
          </div>
        ))}
      </div>
    </div>
  );
}
