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
import { useAddTask, useGetTasks } from "./functions";
import { toast } from "sonner";
import { Divide } from "lucide-react";

export default function Dashboard() {
  const getColorClasses = (status: string) => {
    switch (status) {
      case "todo":
        return "border-gray-500 peer-checked:bg-gray-500";
        break;
      case "in_progress":
        return "border-yellow-400 peer-checked:bg-yellow-400";
        break;
      case "done":
        return "border-green-500 peer-checked:bg-green-500";
        break;
      default:
        return "";
    }
  };

  const getColorClassesForEdit = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-500 hover:bg-gray-600";
        break;
      case "in-progress":
        return "bg-yellow-400 hover:bg-yellow-500";
        break;
      case "done":
        return "bg-green-500 hover:bg-green-600";
        break;
      default:
        return "";
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { addTask } = useAddTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tasks, loading: fetchLoading, refetch } = useGetTasks();

  return (
    <div className="relative">
      <div className="ticket-bar"></div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="flex justify-end mr-5 mt-12">
          <DialogTrigger asChild>
            <Button className="rounded-md cursor-pointer bg-gray-500 hover:bg-gray-600">
              <img className="h-6" src="../icons/add_task_icon.svg"></img> Add
              Task
            </Button>
          </DialogTrigger>
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
        <div className="overflow-x-auto flex gap-4 px-5 pb-5 -mt-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="receipt-card bg-[#FFFDF6] border border-[#CCCCCC] relative h-[517px] w-[251px] flex-shrink-0 shadow-md mt-10"
            >
              <div
                className={`h-2 w-full ${getColorClassesForEdit(task.status)}`}
              ></div>

              <Dialog>
                <div
                  id="editButtonArea"
                  className={`flex mb-0 justify-end mr-2 mt-2`}
                >
                  <DialogTrigger asChild>
                    <Button
                      className={`h-8 w-8 rounded-full cursor-pointer relative ${getColorClassesForEdit(
                        task.status
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
                      placeholder="Update Title"
                      defaultValue={task.title}
                    ></Input>
                    <Label>Task Description</Label>
                    <Textarea
                      placeholder="Update Description"
                      defaultValue={task.description}
                    ></Textarea>
                  </div>

                  <DialogFooter>
                    <Button type="submit">Save</Button>
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
                className="text-sm mx-5 mt-2 line-clamp-6"
              >
                {task.description}
              </div>

              {/* Status */}
              <div className="flex flex-col gap-4 mt-5 mx-5 absolute top-[270px]">
                {["todo", "in_progress", "done"].map((status) => (
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
                        {status.replace("_", " ")}
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Footer */}

              <div className="flex mx-5 w-55 items-center justify-between absolute top-[430px]">
                <div className="flex flex-col">
                  <div>
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    Updated: {new Date(task.created_at).toLocaleDateString()}
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full cursor-pointer active:bg-gray-200"
                    >
                      <img
                        src="../icons/delete_task_icon.svg"
                        alt=""
                        className="h-7 w-7"
                      />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete "{task.title}"?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-red-500 cursor-pointer">
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
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          Your to-do list is quieter than a coffee shop at 2 a.m.
        </div>
      )}
    </div>
  );
}
