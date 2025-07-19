import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: Replace with Firebase auth check
      const savedUser = localStorage.getItem("expense-tracker-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with Firebase auth
      const mockUser: User = {
        id: "1",
        name: "Tejas",
        email: email,
        avatar: "T",
      };

      setUser(mockUser);
      localStorage.setItem("expense-tracker-user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with Firebase auth
      const mockUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: name.charAt(0).toUpperCase(),
      };

      setUser(mockUser);
      localStorage.setItem("expense-tracker-user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with Firebase auth
      setUser(null);
      localStorage.removeItem("expense-tracker-user");

      // Clear all app data on logout
      localStorage.removeItem("expense-tracker-expenses");
      localStorage.removeItem("expense-tracker-groups");
      localStorage.removeItem("expense-tracker-active-group");
      localStorage.removeItem("expense-tracker-profile");
      localStorage.removeItem("expense-tracker-avatar");
    } catch (error) {
      throw new Error("Logout failed");
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with Firebase Google auth
      const mockUser: User = {
        id: "google_" + Date.now(),
        name: "Tejas Patil",
        email: "tejas@gmail.com",
        avatar: "T",
      };

      setUser(mockUser);
      localStorage.setItem("expense-tracker-user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
