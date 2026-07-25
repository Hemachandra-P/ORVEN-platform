import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "info") => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setNotifications((prev) => [newNotification, ...prev]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () =>
    useContext(NotificationContext);