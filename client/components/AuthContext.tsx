import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import {
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  resendSignUpCode as cognitoResendSignUpCode,
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";

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
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  resendSignupCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const APP_STORAGE_KEYS = [
  "expense-tracker-user",
  "expense-tracker-expenses",
  "expense-tracker-groups",
  "expense-tracker-active-group",
  "expense-tracker-profile",
  "expense-tracker-avatar",
];

function clearAppStorage() {
  APP_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

async function getCognitoUser(): Promise<User> {
  const cognitoUser = await getCurrentUser();
  const attributes = await fetchUserAttributes();

  const name = attributes.name || attributes.given_name || attributes.email || "User";
  const email = attributes.email || "";

  return {
    id: cognitoUser.userId,
    name,
    email,
    avatar: name.charAt(0).toUpperCase(),
  };
}

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    let active = true;

    async function checkAuthState() {
      try {
        const currentUser = await getCognitoUser();
        if (active) setUser(currentUser);
      } catch {
        // No valid Cognito session is a normal signed-out state.
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void checkAuthState();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await cognitoSignIn({
        username: email.trim(),
        password,
      });

      if (!result.isSignedIn) {
        const step = result.nextStep.signInStep;

        if (step === "CONFIRM_SIGN_UP") {
          throw new Error(
            "Please verify your email address using the confirmation code before signing in.",
          );
        }

        throw new Error(
          `Additional sign-in step required: ${step}. Please contact support.`,
        );
      }

      const currentUser = await getCognitoUser();
      setUser(currentUser);
      localStorage.setItem("expense-tracker-user", JSON.stringify(currentUser));
    } catch (error) {
      throw new Error(errorMessage(error, "Login failed."));
    } finally {
      setIsLoading(false);
    }
  };

  // Returns true when the user must enter an email confirmation code.
  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await cognitoSignUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            name: name.trim(),
            email: email.trim(),
          },
          autoSignIn: false,
        },
      });

      return result.nextStep.signUpStep === "CONFIRM_SIGN_UP";
    } catch (error) {
      throw new Error(errorMessage(error, "Signup failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignup = async (email: string, code: string) => {
    setIsLoading(true);

    try {
      const result = await cognitoConfirmSignUp({
        username: email.trim(),
        confirmationCode: code.trim(),
      });

      if (!result.isSignUpComplete) {
        throw new Error(
          `Email confirmation requires another step: ${result.nextStep.signUpStep}`,
        );
      }
    } catch (error) {
      throw new Error(errorMessage(error, "Email verification failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const resendSignupCode = async (email: string) => {
    setIsLoading(true);

    try {
      await cognitoResendSignUpCode({
        username: email.trim(),
      });
    } catch (error) {
      throw new Error(
        errorMessage(error, "Could not resend the verification code."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await cognitoSignOut({ global: true });
      setUser(null);
      clearAppStorage();
    } catch (error) {
      throw new Error(errorMessage(error, "Logout failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    throw new Error(
      "Google sign-in is not configured yet. Please sign in with your email and password.",
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        confirmSignup,
        resendSignupCode,
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

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
