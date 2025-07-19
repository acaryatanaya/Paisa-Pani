import { createContext, useContext, useState, useEffect } from "react";

interface Group {
  id: string;
  name: string;
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

const defaultGroups: Group[] = [
  { id: "family", name: "Our Family" },
  { id: "office", name: "Office" },
];

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [activeGroup, setActiveGroupState] = useState("family");

  // Load from localStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem("expense-tracker-groups");
    const savedActiveGroup = localStorage.getItem(
      "expense-tracker-active-group",
    );

    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
    if (savedActiveGroup) {
      setActiveGroupState(savedActiveGroup);
    }
  }, []);

  // Save to localStorage when groups or activeGroup changes
  useEffect(() => {
    localStorage.setItem("expense-tracker-groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("expense-tracker-active-group", activeGroup);
  }, [activeGroup]);

  const setActiveGroup = (groupId: string) => {
    setActiveGroupState(groupId);
  };

  const getActiveGroupName = () => {
    return groups.find((g) => g.id === activeGroup)?.name || "Our Family";
  };

  const addGroup = (group: Group) => {
    setGroups((prev) => [...prev, group]);
  };

  const removeGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (activeGroup === groupId) {
      setActiveGroup(groups[0]?.id || "family");
    }
  };

  const updateGroup = (groupId: string, newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g)),
    );
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        activeGroup,
        setActiveGroup,
        getActiveGroupName,
        addGroup,
        removeGroup,
        updateGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
}
