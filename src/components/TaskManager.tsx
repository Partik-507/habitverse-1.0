
import { useState } from "react";
import { Plus, Target, Clock, Flag, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project proposal", priority: "high", status: "in-progress", category: "Work", timeEstimate: "2h", dueDate: "Today" },
    { id: 2, title: "Morning meditation", priority: "medium", status: "completed", category: "Wellness", timeEstimate: "20m", dueDate: "Today" },
    { id: 3, title: "Team standup meeting", priority: "high", status: "pending", category: "Work", timeEstimate: "30m", dueDate: "Today" },
    { id: 4, title: "Workout session", priority: "medium", status: "pending", category: "Health", timeEstimate: "1h", dueDate: "Today" },
    { id: 5, title: "Read 30 pages", priority: "low", status: "pending", category: "Learning", timeEstimate: "45m", dueDate: "Tomorrow" }
  ]);

  const [newTask, setNewTask] = useState({ title: "", priority: "medium", category: "Personal" });
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (!newTask.title) return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      priority: newTask.priority,
      status: "pending",
      category: newTask.category,
      timeEstimate: "30m",
      dueDate: "Today"
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({ title: "", priority: "medium", category: "Personal" });
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "yellow";
      case "low": return "green";
      default: return "gray";
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Tasks & Goals</h2>
          <p className="text-gray-300">Organize your life, achieve your dreams</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-black/30 rounded-xl px-4 py-2 border border-cyan-500/30">
            <span className="text-cyan-400 font-semibold">
              {tasks.filter(t => t.status === "completed").length}/{tasks.length} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Add New Task */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-cyan-500/30 p-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Add a new task or goal..."
            className="flex-1 bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
            className="bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl p-3 transition-all duration-200"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex space-x-4">
        {["all", "pending", "completed"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-xl capitalize transition-all duration-200 ${
              filter === filterType
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                : "bg-black/30 text-gray-300 hover:bg-white/10 border border-cyan-500/30"
            }`}
          >
            {filterType} ({
              filterType === "all" ? tasks.length :
              filterType === "pending" ? tasks.filter(t => t.status === "pending").length :
              tasks.filter(t => t.status === "completed").length
            })
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const priorityColor = getPriorityColor(task.priority);
          
          return (
            <Card key={task.id} className={`bg-black/20 backdrop-blur-xl border-${priorityColor}-500/30 p-6 hover:scale-[1.02] transition-all duration-200 ${
              task.status === "completed" ? "opacity-60" : ""
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.status === "completed"
                        ? `bg-${priorityColor}-500 border-${priorityColor}-500`
                        : `border-${priorityColor}-500 hover:bg-${priorityColor}-500/20`
                    }`}
                  >
                    {task.status === "completed" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                  
                  <div>
                    <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-gray-400" : "text-white"}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className={`flex items-center space-x-1 text-${priorityColor}-400`}>
                        <Flag className="h-3 w-3" />
                        <span className="text-xs capitalize">{task.priority}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-cyan-400">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{task.timeEstimate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-purple-400">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs bg-${priorityColor}-500/20 text-${priorityColor}-300 border border-${priorityColor}-500/30`}>
                  {task.category}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No tasks found. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
};
