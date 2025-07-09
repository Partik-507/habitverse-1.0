
import { User, Bell, Palette, Shield, Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-300">Customize your LifeOS experience</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-black/20 backdrop-blur-xl border-cyan-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Profile</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Display Name</label>
              <input
                type="text"
                defaultValue="Digital Pioneer"
                className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <input
                type="email"
                defaultValue="pioneer@lifeos.com"
                className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Time Zone</label>
              <select className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400">
                <option>UTC-8 (Pacific)</option>
                <option>UTC-5 (Eastern)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Language</label>
              <select className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { label: "Task Reminders", description: "Get notified about upcoming deadlines" },
            { label: "Habit Notifications", description: "Daily reminders for your habits" },
            { label: "AI Insights", description: "Weekly analysis and suggestions" },
            { label: "Achievement Alerts", description: "Celebrate your wins and milestones" },
            { label: "Focus Session Reminders", description: "Pomodoro and deep work notifications" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">{item.label}</div>
                <div className="text-sm text-gray-400">{item.description}</div>
              </div>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-purple-400 rounded-full absolute top-0.5 right-0.5 transition-all duration-200"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance */}
      <Card className="bg-black/20 backdrop-blur-xl border-green-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Appearance</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div>
            <label className="text-sm text-gray-300 mb-3 block">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Cyberpunk", colors: ["from-purple-500", "to-cyan-500"], active: true },
                { name: "Forest", colors: ["from-green-500", "to-emerald-500"], active: false },
                { name: "Sunset", colors: ["from-orange-500", "to-pink-500"], active: false },
                { name: "Ocean", colors: ["from-blue-500", "to-teal-500"], active: false }
              ].map((theme, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    theme.active
                      ? `bg-gradient-to-r ${theme.colors[0]} ${theme.colors[1]} border-2 border-white/50`
                      : `bg-gradient-to-r ${theme.colors[0]} ${theme.colors[1]} opacity-60 hover:opacity-80`
                  }`}
                >
                  <div className="text-white font-medium text-center">{theme.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* UI Preferences */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Animation Speed</label>
              <select className="w-full bg-black/30 border border-green-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400">
                <option>Fast</option>
                <option>Normal</option>
                <option>Slow</option>
                <option>Disabled</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">Particle Effects</div>
                <div className="text-sm text-gray-400">Background animations</div>
              </div>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-green-400 rounded-full absolute top-0.5 right-0.5 transition-all duration-200"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="bg-black/20 backdrop-blur-xl border-red-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <div className="font-medium text-white">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Add an extra layer of security</div>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <div className="font-medium text-white">Data Encryption</div>
              <div className="text-sm text-gray-400">Journal and personal data encryption</div>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-green-400 rounded-full absolute top-0.5 right-0.5 transition-all duration-200"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="bg-black/20 backdrop-blur-xl border-yellow-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Data Management</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl p-4 transition-all duration-200">
            <Download className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="font-medium text-white">Export Data</div>
            <div className="text-sm text-gray-400 mt-1">Download all your data</div>
          </button>
          
          <button className="bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 rounded-xl p-4 transition-all duration-200">
            <Trash2 className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <div className="font-medium text-white">Reset All Data</div>
            <div className="text-sm text-gray-400 mt-1">Start fresh (irreversible)</div>
          </button>
        </div>
      </Card>
    </div>
  );
};
