import { createContext, useContext, useState } from 'react';
import { CLIENTS, TASKS, USERS, NOTIFICATIONS, SOFTWARE_INSTANCES, ACTIVITY_LOGS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [clients, setClients] = useState(CLIENTS);
  const [tasks, setTasks] = useState(TASKS);
  const [users, setUsers] = useState(USERS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [instances, setInstances] = useState(SOFTWARE_INSTANCES);
  const [logs, setLogs] = useState(ACTIVITY_LOGS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addClient = (client) => {
    const newClient = {
      ...client,
      id: `CLT-${String(clients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      onboardingProgress: 10,
      onboardingStage: 'Client Created',
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c));
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      clients, setClients, addClient, updateClient, deleteClient,
      tasks, setTasks, addTask, updateTask, deleteTask,
      users, setUsers,
      notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
      instances, setInstances,
      logs,
      sidebarCollapsed, setSidebarCollapsed,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
