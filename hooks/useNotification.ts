import {
  deleteNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  notifications,
  sendNotification,
} from "@/service/notificationService";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useNotifications = () => {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState<notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //notif yang belum dibaca
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      //admin ambil semua, user ambil untuk user saja
      const data =
        role === "admin"
          ? await getAllNotifications()
          : await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      setError("Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  }, [role]);
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  //kirim notifikasi khusus admin
  const send = useCallback(
    async (
      title: string,
      massage: string,
      targetRole: "all" | "user" | "admin",
    ) => {
      try {
        await sendNotification({ Title: title, massage, targetRole });
        await fetchNotifications();
      } catch (error) {
        setError("Gagal mengirim notifikasi");
      } finally {
        setLoading(false);
      }
    },
    [fetchNotifications],
  );
  // tandai yang sudah baca
  const read = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      //update state tanpa memuat ulang data
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isread: true } : n)),
      );
    } catch (error) {
      setError("gagal tandai dibaca");
    }
  }, []);
  //hapus notifikasi khusus admin
  const remove = useCallback(async (notificationsId: string) => {
    try {
      await deleteNotification(notificationsId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationsId));
    } catch (error) {
      setError("gagal dihapus");
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    send,
    read,
    remove,
  };
};
