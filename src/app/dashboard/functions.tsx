"use client";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";

export const useAddTask = () => {
  const session = useSession();
  const addTask = async (title: string, description: string) => {
    if (!title.trim()) return { error: "Title is required" };
    const { data, error } = await supabase.from("tasks").insert([
      {
        user_id: session?.user?.id,
        title,
        description,
        status: "todo",
      },
    ]);
    return { data, error };
  };
  return { addTask };
};

import { useSessionContext } from "@supabase/auth-helpers-react";

export const useGetTasks = () => {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error(error.message);
        setTasks([]);
      } else {
        // const statusPriority = {
        //   in_progress: 1,
        //   todo: 2,
        //   done: 3,
        // };

        // const sorted = (data || []).sort((a, b) => {
        //   return (
        //     statusPriority[a.status as "in_progress" | "todo" | "done"] -
        //     statusPriority[b.status as "in_progress" | "todo" | "done"]
        //   );
        // });

        setTasks(data || null);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);
  useEffect(() => {
    if (!sessionLoading) {
      if (session?.user?.id) {
        fetchTasks();
      } else {
        setTasks([]);
        setLoading(false);
      }
    }
  }, [sessionLoading, session?.user?.id, fetchTasks]);

  return {
    tasks,
    loading: loading || sessionLoading,
    refetch: fetchTasks,
  };
};

export const useUpdateTask = () => {
  const session = useSession();

  const updateTask = async (
    taskId: string,
    title: string,
    description: string
  ) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ title, description })
      .eq("id", taskId)
      .eq("user_id", session?.user?.id);

    return { data, error };
  };

  return { updateTask };
};

export const useUpdateStatus = () => {
  const session = useSession();

  const updateStatus = async (taskId: string, status: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)
      .eq("user_id", session?.user?.id);

    return { data, error };
  };

  return { updateStatus };
};

export const useDeleteTask = () => {
  const session = useSession();

  const deleteTask = async (taskId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", session?.user?.id);

    return { data, error };
  };

  return { deleteTask };
};
