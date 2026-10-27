import { createContext, useContext, useState, useEffect } from "react";

export interface Group {
  id: string;
  name: string;
  createdAt?: string;
}

interface GroupContextType {
  groups: Group[];
  activeGroup: string;
  setActiveGroup: (groupId: string) => void;
  getActiveGroupName: () => string;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, newName: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);
const GROUPS_KEY = "expense-tracker-groups";
const ACTIVE_GROUP_KEY = "expense-tracker-active-group";
const LEGACY_DEMO_GROUPS = new Set(["family", "office"]);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroupState] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedGroups = JSON.parse(localStorage.getItem(GROUPS_KEY) || "[]");
      const safeGroups: Group[] = Array.isArray(savedGroups)
        ? savedGroups.filter((group) => group && typeof group.id === "string" && typeof group.name === "string" && !LEGACY_DEMO_GROUPS.has(group.id))
        : [];
      setGroups(safeGroups);
      const savedActiveGroup = localStorage.getItem(ACTIVE_GROUP_KEY) || "";
      setActiveGroupState(safeGroups.some((group) => group.id === savedActiveGroup) ? savedActiveGroup : "");
    } catch {
      setGroups([]);
      setActiveGroupState("");
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }, [groups, initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (activeGroup) localStorage.setItem(ACTIVE_GROUP_KEY, activeGroup);
    else localStorage.removeItem(ACTIVE_GROUP_KEY);
  }, [activeGroup, initialized]);

  const setActiveGroup = (groupId: string) => setActiveGroupState(groupId);
  const getActiveGroupName = () => groups.find((group) => group.id === activeGroup)?.name || "Personal expenses";

  const addGroup = (group: Group) => {
    setGroups((previous) => [...previous, group]);
    setActiveGroupState(group.id);
  };

  const removeGroup = (groupId: string) => {
    const remaining = groups.filter((group) => group.id !== groupId);
    setGroups(remaining);
    if (activeGroup === groupId) setActiveGroupState(remaining[0]?.id || "");
  };

  const updateGroup = (groupId: string, newName: string) => {
    setGroups((previous) => previous.map((group) => group.id === groupId ? { ...group, name: newName } : group));
  };

  return (
    <GroupContext.Provider value={{ groups, activeGroup, setActiveGroup, getActiveGroupName, addGroup, removeGroup, updateGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within a GroupProvider");
  return context;
}
