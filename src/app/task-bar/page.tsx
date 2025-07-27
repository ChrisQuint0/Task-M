//app/task-bar/page.tsx

"use client";

//General Button
import { Button } from "@/components/ui/button";

//General input
import { Input } from "@/components/ui/input";

//General Textarea
import { Textarea } from "@/components/ui/textarea";

//General label
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";

// For the add task and update task forms
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// For the delete confirmation
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

//Functions from functions.tsx
import {
  useAddTask,
  useGetTasks,
  useUpdateTask,
  useUpdateStatus,
  useDeleteTask,
} from "./functions";

//For user confirmations and error messages
import { toast } from "sonner";

//For the filter (Todo, In Progress, Done)
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

//For toggle theme
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//For animation
import { motion, AnimatePresence } from "framer-motion";

//For Logout
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Determining the color fo the radio button
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

// For edit button and the color indicator at the top of the ticker
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

// For the border of the ticket as well as the shadow
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

import { Task } from "./functions";

import Image from "next/image";

// Function to render the Task Card
function TaskCard({ task, refetch }: { task: Task; refetch: () => void }) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [statusMap, setStatusMap] = useState<{ [taskId: string]: string }>({});
  const { updateTask } = useUpdateTask();
  const { updateStatus } = useUpdateStatus();
  const { deleteTask } = useDeleteTask();
  const [dropped, setDropped] = useState(false);

  const handlePermanentDelete = async () => {
    const { error } = await deleteTask(task.id);
    if (!error) {
      toast.success("Task deleted successfully!");
      setDropped(true);

      setTimeout(refetch, 1000);
    } else {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 1, y: 0 }}
      animate={dropped ? { opacity: 0, y: 200 } : { y: 0, opacity: 1 }}
      transition={
        dropped
          ? { duration: 0.3, ease: "easeOut" }
          : { duration: 0.3, ease: "easeIn" }
      }
      className={`${getColorClassesForTicketBorder(
        statusMap[task.id] ?? task.status
      )}  receipt-card bg-[#FFFDF6]/90 dark:bg-[#020618cc] border relative h-[600px] w-[251px] flex-shrink-0 shadow-md mt-13 sm:mt-10 md:mt-10 dark:text-white`}
    >
      <div
        className={`h-2 w-full ${getColorClassesForEdit(
          statusMap[task.id] ?? task.status
        )}`}
      ></div>{" "}
      {/*Color indicator at the top of the ticket*/}
      <Dialog>
        <div id="editButtonArea" className={`flex mb-0 justify-end mr-2 mt-2`}>
          <DialogTrigger asChild>
            <Button
              className={`h-8 w-8 rounded-full cursor-pointer relative ${getColorClassesForEdit(
                statusMap[task.id] ?? task.status
              )}`}
            >
              {" "}
              <Image
                className="absolute h-4"
                src="../icons/edit_task_icon.svg"
                alt=""
                height={60}
                width={60}
              ></Image>
            </Button>
          </DialogTrigger>
        </div>

        {/* Dialog content for editing */}
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
          <div>Updated: {new Date(task.updated_at).toLocaleDateString()}</div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer active:bg-gray-200"
            >
              <Image
                src="../icons/delete_task_icon.svg"
                alt=""
                height={60}
                width={60}
                className="h-7 w-7 dark:filter dark:invert dark:brightness-50"
              />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete &quot;{task.title}&quot;?
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
                onClick={handlePermanentDelete}
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
    </motion.div>
  );
}

export default function Dashboard() {
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        //No user found, redirect to login
        router.push("/login");
      }
    };

    checkUser();

    //Real time reactivity
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          toast.error("You've been signed out. Please log in");
          router.push("/login");
        } else if (event === "SIGNED_IN" && session?.user) {
          //User signed in, do nothing or refetch tasks
          console.log("User signed in: ", session.user.id);
        }
      }
    );

    return () => {
      //Clean up the subscription when the component unmounts
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { addTask } = useAddTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiDialogContent, setAiDialogContent] = useState("");
  const [aiDialogLoading, setAiDialogLoading] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { tasks, loading: fetchLoading, refetch } = useGetTasks();
  const [activeTab, setActiveTab] = useState("all");

  //Handle the logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("You've logged out. I'll be napping until you return");
      router.push("/login");
    } else {
      toast.error("I tried, but the logout didn't work");
      console.error(`Logout failed: ${error.message}`);
    }
  };

  const handleGenerateTasksWithAI = async () => {
    if (!aiDialogContent.trim()) {
      toast.error(
        "C'mon, type something! I swear I won't sit on your keyboard… this time."
      );
      return;
    }

    setAiDialogLoading(true);

    //Call Next.js API route
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: `Break down the following high-level task into a list of smaller, actionable, and specific sub-tasks. Provide the output as a JSON array of objects, where each object has a 'title', (string, max of 70 characters) and a 'description' (string). Do NOT include any additional text, markdown formatting outside the JSON, or explanations. Example: '[{"title": "Subtask 1", "description":"Details for subtask 1"}, {"title": "Subtask 2", "description": "Details for subtask 2"}]'
          High-level task ${aiDialogContent}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "This one’s a tough nut to paw open. Maybe give it another go?"
        );
      }

      let rawGeneratedText = data.generatedText;

      //Remove markdown code, this is important, Gemini is losing its shit even though I said don't include any markdowns
      if (rawGeneratedText.startsWith("```json\n")) {
        rawGeneratedText = rawGeneratedText.substring("```json\n".length);
      }
      if (rawGeneratedText.endsWith("```")) {
        rawGeneratedText = rawGeneratedText.substring(
          0,
          rawGeneratedText.length - "```".length
        );
      }
      rawGeneratedText = rawGeneratedText.trim();
      //Parse the AI's response
      let generatedTasks;

      try {
        generatedTasks = JSON.parse(rawGeneratedText);

        if (!Array.isArray(generatedTasks)) {
          throw new Error(
            "The AI coughed up… something. But it sure wasn’t a task list."
          );
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        toast.error(
          "Oops! TiM chased a laser instead of your task. Mind rephrasing it?"
        );
        return;
      }

      //Add to database
      if (generatedTasks.length > 0) {
        for (const task of generatedTasks) {
          if (task.title && task.description) {
            const { error } = await addTask(task.title, task.description);
            if (error) {
              console.error("Error adding task from AI: ", error);
              toast.error(
                `Failed to add task "${task.title}": ${error.toString()}`
              );
            }
          }
        }

        toast.success(
          "TiM successfully broke down your task! Paws-itively productive!"
        );
        await refetch();

        setAiDialogContent("");
        setAiDialogOpen(false);
      } else {
        toast.info(
          "Even my feline genius has limits. Try a clearer task and I'll pounce on it!"
        );
      }
    } catch (error) {
      console.error("Error during AI task generation: ", error);
      toast.error("Something went wrong with TiM the Task Cat!");
    } finally {
      setAiDialogLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    return task.status === activeTab;
  });

  return (
    <div className="relative">
      {/*Backdrop for the ticket bar to make it more visible */}
      <div className="bg-[#fafafa] h-[22px] absolute left-0 w-screen top-[90px] sm:top-[50px] dark:bg-background"></div>{" "}
      {/* Ticket Bar */}
      <div className="ticket-bar dark:ticket-bar-dark"></div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Main Container for the controls */}
        <div className="flex flex-col gap-2 items-center sm:flex-row sm:justify-between sm:mr-5 mt-12 sm:mt-6">
          <div className="flex items-center">
            {/* Filter Tabs */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="-mt-5 sm:mt-0"
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className=" bg-gray-500  hover:bg-gray-600 dark:text-white cursor-pointer ml-5 active:bg-gray-500">
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Before you go… are you absolutely, positively sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    All your tasks will be waiting patiently for your return.
                    Well...If there&apos;s any.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 cursor-pointer text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex gap-4 ml-3">
            {" "}
            {/* Main Container for the left side of the controls */}
            {/* TiM the Task Cat */}
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Image
                    src="/icons/TiM_AI_Cat_Mascot.svg"
                    alt=""
                    width={60}
                    height={60}
                    className="bg-transparent"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex gap-2 items-center">
                      <Image
                        src="/icons/TiM_AI_Cat_Mascot.svg"
                        alt=""
                        width={60}
                        height={60}
                        className="h-15 w-15"
                      />
                      TiM the Task Cat is on the Case!
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    Struggling to get started? Just tell me what you’re working
                    on and I’ll split it into smaller, doable steps. Easy peasy,
                    Lemon... NVM I hate lemons.
                  </DialogDescription>
                </DialogHeader>

                <Textarea
                  placeholder="Tell me what you’re working on… I promise not to nap on it."
                  className="max-h-50"
                  value={aiDialogContent}
                  onChange={(e) => setAiDialogContent(e.target.value)}
                  disabled={aiDialogLoading}
                ></Textarea>

                <DialogFooter>
                  <Button
                    className="cursor-pointer"
                    type="button"
                    onClick={handleGenerateTasksWithAI}
                    disabled={aiDialogLoading}
                  >
                    {aiDialogLoading
                      ? "Paw-cessing your task... please hold the tuna."
                      : "Go, Task Cat, Go!"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Add Task Dialog Trigger */}
            <DialogTrigger asChild>
              <Button className="rounded-md cursor-pointer bg-gray-500 hover:bg-gray-600 dark:text-white">
                <Image
                  className="h-6"
                  src="../icons/add_task_icon.svg"
                  alt=""
                  height={60}
                  width={60}
                ></Image>{" "}
                Add Task
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
        <div className="flex justify-center text-lg text-white mt-50">
          Wait for it...
        </div>
      ) : filteredTasks.length > 0 ? (
        (() => {
          return (
            <div
              className="overflow-x-auto overflow-y-visible flex gap-4 px-5 pb-5 -mt-4"
              style={{ minHeight: "650px" }}
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} refetch={refetch} />
                ))}
              </AnimatePresence>
            </div>
          );
        })()
      ) : (
        <div className="text-sm sm:text-lg text-center text-white bg-black/50 dark:bg-black/0 mt-25">
          Your to-do list is quieter than a coffee shop at 2 a.m.
        </div>
      )}
    </div>
  );
}
