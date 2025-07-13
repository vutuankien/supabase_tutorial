import { useEffect, useState } from 'react'

import { supabase } from './supabase-client';



function App() {

  const [newTask, setNewTask] = useState({ title: "", description: "", image_url: "" });
  const [tasks, setTasks] = useState([]);
  const [taskImage, setTaskImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
      if (!imageUrl) {
        alert("Image upload failed.");
        return;
      }
    }

    const taskToInsert = {
      ...newTask,
      image_url: imageUrl
    };

    const { data, error } = await supabase.from('tasks').insert([taskToInsert]);
    if (error) {
      console.error("Error inserting task:", error);
      return;
    } else {
      console.log("Task inserted successfully:", data);
    }
    setNewTask({ title: "", description: "", image_url: "" });
    setTaskImage(null);
  };

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('task-images').upload(fileName, file);
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    const { data: urlData } = supabase.storage.from('task-images').getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select()

    if (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      return;
    }
    setTasks(Array.isArray(data) ? data : []);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("tasks-channel");
    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        const newTask = payload.new;
        setTasks((prevTasks) => {
          // Avoid duplicate tasks if already present
          if (prevTasks.some(task => task.id === newTask.id)) return prevTasks;
          return [newTask, ...prevTasks];
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
        const deletedTaskId = payload.old.id;
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleEdit = (id) => {
    // TODO: Implement edit logic
    alert(`Edit task ${id}`);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit.");
        return;
      }
      setTaskImage(file);
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await supabase.from('tasks').delete().eq('id', id).then(({ error }) => {
      if (error) {
        console.error("Error deleting task:", error);
        return;
      }
      setTasks(tasks.filter(task => task.id !== id));
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2>Todo App</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <input type='file' accept='image/*' onChange={handleFileChange} />
        <button type="submit" style={{ padding: 10, fontSize: 16, background: "#6366f1", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Add Task
        </button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ padding: 8, border: "1px solid #e5e7eb" }}>Title</th>
            <th style={{ padding: 8, border: "1px solid #e5e7eb" }}>Description</th>
            <th style={{ padding: 8, border: "1px solid #e5e7eb" }}>Created At</th>
            <th style={{ padding: 8, border: "1px solid #e5e7eb" }}>Image URL</th>
            <th style={{ padding: 8, border: "1px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 16, color: "#888" }}>No tasks found.</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td style={{ padding: 8, border: "1px solid #e5e7eb" }}>{task.title}</td>
                <td style={{ padding: 8, border: "1px solid #e5e7eb" }}>{task.description}</td>
                <td style={{ padding: 8, border: "1px solid #e5e7eb" }}>{task.created_at}</td>
                <td style={{ padding: 8, border: "1px solid #e5e7eb" }}>
                  {task.image_url && task.image_url.length > 30
                    ? task.image_url.slice(0, 30) + '...'
                    : task.image_url}
                </td>
                <td style={{ padding: 8, border: "1px solid #e5e7eb" }}>
                  <button onClick={() => handleEdit(task.id)} style={{ marginRight: 8, padding: "4px 12px", background: "#fbbf24", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ padding: "4px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App
