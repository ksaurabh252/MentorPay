import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const getRolePermissions = (role) => ({
  sessions: {
    create: ["admin", "mentor"].includes(role),
    view: true,
  },
  receipts: {
    generate: true,
    view: true,
  },
  taxes: {
    modify: role === "admin",
    view: true,
  },
  audit: {
    view_own: true,
    view_all: role === "admin",
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user"); // Clear corrupted data
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) throw new Error("Invalid credentials");

      const userData = {
        ...user,
        isAdmin: user.role === 'admin',
        isMentor: user.role === 'mentor'
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Invalid credentials");
    }
  };

  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some((u) => u.email === email);
        userExists ? resolve() : reject(new Error("Email not found"));
      } catch (error) {
        reject(new Error("Failed to access user data"));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    resetPassword,
    permissions: user ? getRolePermissions(user.role) : null,
    // Add safe user getter
    getSafeUser: () => {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error("Failed to parse user data:", error);
        return null;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;