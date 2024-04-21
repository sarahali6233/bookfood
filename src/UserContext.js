import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user data from localStorage, which might include the email
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Sync the user data with localStorage
    if (user) {
      // Save user data except password
      const { password, ...userDataWithoutPassword } = user;
      localStorage.setItem("user", JSON.stringify(userDataWithoutPassword));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const updateUser = (newUserData) => {
    // You should not store the password in state or localStorage.
    // Remove the password from the userData if it exists.
    const { password, ...userDataWithoutPassword } = newUserData;
    setUser(userDataWithoutPassword);
  };

  const clearUser = () => {
    setUser(null);
  };

  // The resetUser function should probably do more than just clear the user.
  // You might want to navigate back to the login page or perform other cleanup tasks.
  const resetUser = () => {
    setUser(null);
  };

  // Make sure you provide all necessary data and functions to the context
  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
