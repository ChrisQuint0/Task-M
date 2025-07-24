"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  useAddTask,
  useGetTasks,
  useUpdateTask,
  useUpdateStatus,
  useDeleteTask,
} from "./functions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getColorClasses = (status: string) => {
  switch (status) {
    case "todo":
      return "border-red-500 dark:border-red-600 peer-checked:bg-red-500 dark:peer-checked:bg-red-600";
      break;
    case "in_progress":
      return "border-yellow-400 dark:border-yellow-500/80 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-500/80";
      break;
    case "done":
      return "border-green-500 dark:border-green-700 peer-checked:bg-green-500 dark:peer-checked:bg-green-700";
      break;
    default:
      return "";
  }
};

const getColorClassesForEdit = (status: string) => {
  switch (status) {
    case "todo":
      return "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700";
      break;
    case "in_progress":
      return "bg-yellow-400 dark:bg-yellow-500/80 hover:bg-yellow-500 dark:hover:bg-yellow-500/90";
      break;
    case "done":
      return "bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800";
      break;
    default:
      return "";
  }
};

const getColorClassesForTicketBorder = (status: string) => {
  switch (status) {
    case "todo":
      return "border-red-500 dark:border-red-600 dark:shadow-md dark:shadow-red-600";
    case "in_progress":
      return "border-yellow-400 dark:border-yellow-500/80 dark:shadow-md dark:shadow-yellow-500/80";
    case "done":
      return "border-green-500 dark:border-green-700 dark:shadow-md dark:shadow-green-700";
    default:
      return "";
  }
};

function TaskCard({ task, refetch }: { task: any; refetch: () => void }) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [statusMap, setStatusMap] = useState<{ [taskId: string]: string }>({});
  const { updateTask } = useUpdateTask();
  const { updateStatus } = useUpdateStatus();
  const { deleteTask } = useDeleteTask();

  return (
    <div
      key={task.id}
      className={`${getColorClassesForTicketBorder(
        statusMap[task.id] ?? task.status
      )}  receipt-card bg-[#FFFDF6]/95 dark:bg-[#020618cc] border  relative h-[600px] w-[251px] flex-shrink-0 shadow-md mt-10 dark:text-white`}
    >
      <div
        className={`h-2 w-full ${getColorClassesForEdit(
          statusMap[task.id] ?? task.status
        )}`}
      ></div>
      <Dialog>
        <div id="editButtonArea" className={`flex mb-0 justify-end mr-2 mt-2`}>
          <DialogTrigger asChild>
            <Button
              className={`h-8 w-8 rounded-full cursor-pointer relative ${getColorClassesForEdit(
                statusMap[task.id] ?? task.status
              )}`}
            >
              {" "}
              <img
                className="absolute h-4"
                src="../icons/edit_task_icon.svg"
                alt=""
              ></img>
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>
              Edit your task and click Save to update it
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Label>Task Title</Label>
            <Input
              maxLength={70}
              placeholder="Update Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            ></Input>
            <Label>Task Description</Label>
            <Textarea
              placeholder="Update Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="h-50"
            ></Textarea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={async () => {
                const { error } = await updateTask(
                  task.id,
                  editTitle,
                  editDescription
                );
                if (!error) {
                  toast.success("Task updated successfully!");
                  await refetch();
                } else {
                  toast.error(error.message);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Title */}
      <div id="taskTitle" className="font-semibold text-2xl mx-5 mt-2">
        {task.title}
      </div>
      {/* Description */}
      <div
        id="taskDescription"
        className="text-sm mx-5 mt-2 whitespace-pre-line line-clamp-12"
      >
        {task.description}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-4 mt-5 mx-5 absolute top-[350px]">
        {["todo", "in_progress", "done"].map((status) => (
          <div key={status}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`status-${task.id}`}
                value={status}
                defaultChecked={task.status === status}
                className="sr-only peer"
                onChange={async () => {
                  setStatusMap((prev) => ({
                    ...prev,
                    [task.id]: status,
                  }));

                  const { error } = await updateStatus(task.id, status);

                  if (!error) {
                    status === "todo"
                      ? toast.success("Status changed to To Do")
                      : status === "in_progress"
                      ? toast.success(`Status changed to In Progress`)
                      : toast.success(`Status changed to Done`);
                  } else {
                    toast.error(error.message);
                  }

                  await refetch();
                }}
              />
              <div
                className={`w-4 h-4 rounded-full border-2 ${getColorClasses(
                  status
                )}`}
              ></div>
              <span className="text-lg capitalize">
                {status.replace("_", " ")}
              </span>
            </label>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="flex mx-5 w-55 items-center justify-between absolute top-[510px]">
        <div className="flex flex-col">
          <div>Created: {new Date(task.created_at).toLocaleDateString()}</div>
          <div>Updated: {new Date(task.created_at).toLocaleDateString()}</div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer active:bg-gray-200"
            >
              <img
                src="../icons/delete_task_icon.svg"
                alt=""
                className="h-7 w-7 dark:filter invert brightness-50"
              />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete "{task.title}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-red-500 cursor-pointer"
                onClick={async () => {
                  const { error } = await deleteTask(task.id);
                  if (!error) {
                    toast.success("Task deleted successfully!");
                  } else {
                    toast.error(error.message);
                  }

                  await refetch();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {/* Decorative Receipt Lines */}
      <svg
        className="absolute bottom-0 left-0 w-full h-4"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      ></svg>
    </div>
  );
}

export default function Dashboard() {
  const { setTheme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { addTask } = useAddTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tasks, loading: fetchLoading, refetch } = useGetTasks();
  const [statusMap, setStatusMap] = useState<{ [taskId: string]: string }>({});
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="relative">
      <div className="bg-[#fafafa] w-full h-[22px] absolute left-0 w-screen top-[50px] dark:bg-background"></div>
      <div className="ticket-bar dark:ticket-bar-dark"></div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="flex justify-between mr-5 mt-12">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="ml-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger
                value="todo"
                className="data-[state=active]:bg-red-500 dark:data-[state=active]:bg-red-700 data-[state=active]:text-white"
              >
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in_progress"
                className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500/80 data-[state=active]:text-white"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="done"
                className="data-[state=active]:bg-green-500 dark:data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex justify-between gap-2">
            <DialogTrigger asChild>
              <Button className="rounded-md cursor-pointer bg-gray-500 hover:bg-gray-600 dark:text-white">
                <img className="h-6" src="../icons/add_task_icon.svg"></img> Add
                Task
              </Button>
            </DialogTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Fill in the task details below and click Save to add it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Label>Title</Label>
            <Input
              maxLength={70}
              placeholder="Add Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <Label>Description</Label>
            <Textarea
              placeholder="Description"
              className="h-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Textarea>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={async () => {
                setLoading(true);
                const { error } = await addTask(title, description);
                if (!error) {
                  setTitle("");
                  setDescription("");
                  toast.success("Task added successfully");
                  setDialogOpen(false);
                  await refetch();
                } else {
                  toast.error(error.toString());
                }

                setLoading(false);
              }}
              disabled={loading}
              className="cursor-pointer"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {fetchLoading ? (
        <div className="flex justify-center text-lg text-gray-500 mt-50">
          Wait for it...
        </div>
      ) : tasks.length > 0 ? (
        (() => {
          const filteredTasks = tasks.filter((task) => {
            if (activeTab === "all") return true;
            return task.status === activeTab;
          });

          return (
            <div className="overflow-x-auto flex gap-4 px-5 pb-5 -mt-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} refetch={refetch} />
              ))}
            </div>
          );
        })()
      ) : (
        <div className="text-center text-gray-500 mt-20">
          Your to-do list is quieter than a coffee shop at 2 a.m.
        </div>
      )}
    </div>
  );
}
