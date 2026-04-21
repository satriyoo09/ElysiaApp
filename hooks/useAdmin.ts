import { useCallback, useEffect, useState } from "react";
import {
  addBook,
  dasbordStats,
  deleteBook,
  deleteUser,
  getAllNotifications,
  getAllUsers,
  getDasboardStats,
  sendNotification,
  toggleRecomendation,
  updateBook,
  updateUserRole,
  userData,
} from "../service/adminService";
import { books, getallBooks } from "../service/bookservice";
import {
  deleteNotification,
  notifications,
} from "../service/notificationService";

const useAdmin = () => {
  // state //
  const [stats, setStats] = useState<dasbordStats>({
    totalBooks: 0,
    totalUsers: 0,
    TotalNotifications: 0,
    TotalrecommendedBooks: 0,
  });
  const [users, setUsers] = useState<userData[]>([]);
  const [books, setBooks] = useState<books[]>([]);
  const [notifications, setNotifications] = useState<notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoding, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch semua data di dasboard
  const fetchDasboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      //ambil semua data sekaligus
      const [statsdata, usersdata, booksdata, notificationsdata] =
        await Promise.all([
          getDasboardStats(),
          getAllUsers(),
          getallBooks(),
          getAllNotifications(),
        ]);

      setStats(statsdata);
      setUsers(usersdata);
      setBooks(booksdata);
      setNotifications(notificationsdata);
    } catch (error) {
      console.error("gagal ambil data");
    }
  }, []);

  useEffect(() => {
    fetchDasboard();
  }, [fetchDasboard]);

  //fungsi kelola books
  const handleBooks = useCallback(
    async (booksData: Omit<books, "id" | "createAt">) => {
      try {
        setActionLoading(true);
        await addBook(booksData);
        await fetchDasboard();
        return true;
      } catch (error) {
        console.error("gagal ambil buku, jajal ulangi maning");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDasboard],
  );

  // fungsi uodate buku
  const handleUpdateBooks = useCallback(
    async (bookId: string, data: Partial<books>) => {
      try {
        setLoading(true);
        await updateBook(bookId, data);
        await fetchDasboard();
        return true;
      } catch (error) {
        console.error("gagal update rekomendasi");
      } finally {
        setLoading(false);
      }
    },
    [fetchDasboard],
  );

  //hapus buku
  const handledeleteBooks = +useCallback(async (bookId: string) => {
    try {
      setActionLoading(true);
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setStats((prev) => ({
        ...prev,
        totalBooks: prev.totalBooks - 1,
      }));
      return true;
    } catch (error) {
      console.error("gagal hapus buku");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);
  //set rokomendasi untuk admin
  const handleToggleRekomendation = useCallback(
    async (bookId: string, status: boolean) => {
      try {
        await toggleRecomendation(bookId, status);
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId ? { ...b, isRecommended: status } : b,
          ),
        );
      } catch (error) {
        console.error("gagal set rekomendasi buku");
      }
    },
    [],
  );

  // kelola user
  const handleupdateRole = useCallback(
    async (userId: string, role: "user" | "admin") => {
      try {
        setActionLoading(true);
        await updateUserRole(userId, role);
        setUsers((prev) =>
          prev.map((u) => (u.uid === userId ? { ...u, role } : u)),
        );
      } catch (error) {
        console.error("gagal update role user");
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  //dalete user
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setActionLoading(true);
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.uid !== userId));
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      return true;
    } catch (error) {
      console.error("gagal hapus user");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  //fungsi kirim notifikasi
  const handleSendNotification = useCallback(
    async (
      title: string,
      message: string,
      targetRole: "all" | "user" | "admin" = "all",
    ) => {
      try {
        setActionLoading(true);
        await sendNotification({ Title: title, massage: message, targetRole });
        await fetchDasboard();
        return true;
      } catch (error) {
        setError("Gagal kirim notifikasi.");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDasboard],
  );

  // hapus notif
  const handleDeleteNotification = useCallback(async (notifiId: string) => {
    try {
      await deleteNotification(notifiId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifiId));
    } catch (error) {
      console.error("gagal hapus notifikasi");
      return false;
    }
  }, []);

  return {
    // data
    stats,
    users,
    books,
    notifications,
    loading,
    actionLoding,
    error,
    fetch: fetchDasboard,
    //function books
    addBook: handleBooks,
    updateBook: handleUpdateBooks,
    deleteBook: handledeleteBooks,
    toggleRecomendation: handleToggleRekomendation,
    //function users
    updateRole: handleupdateRole,
    deleteUser: handleDeleteUser,
    //function notifications
    sendNotification: handleSendNotification,
    deleteNotification: handleDeleteNotification,
  };
};
