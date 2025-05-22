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
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // First check localStorage users
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) throw new Error("Invalid credentials");

      // if (user.password !== password) {
      //   throw new Error('Invalid password');
      // }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Invalid credentials");
    }
  };

  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some((u) => u.email === email);

        if (userExists) {
          resolve();
        } else {
          reject(new Error("Email not found"));
        }
      }, 1000);
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
  };

  // const getRolePermissions = (role) => {
  //   const base = {
  //     sessions: {
  //       create: false,
  //       view: true
  //     },
  //     receipts: {
  //       generate: true,
  //       view: true
  //     },
  //     taxes: {
  //       modify: false,
  //       view: true
  //     },
  //     audit: {
  //       view_own: true,
  //       view_all: false
  //     }
  //   };

  //   if (role === 'admin') {
  //     base.sessions.create = true;
  //     base.taxes.modify = true;
  //     base.audit.view_all = true;
  //   }

  //   return base;
  // };

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
  return {
    ...context,

    permissions: context.user ? getRolePermissions(context.user.role) : null,
  };
};

export default AuthProvider;
