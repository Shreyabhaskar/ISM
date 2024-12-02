"use client";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { apiBaseUrl } from "@/lib/baseUrl";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import { usePathname } from "next/navigation";
export const UserContext = createContext(null);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const unprotectedRoutes = ["/" , '/signup']
  useEffect(() => {
    let token = Cookies.get("token");
    
    if (!token && !unprotectedRoutes.includes(pathname)) {
      setIsLoading(false);
      router.push("/signin");
    } else {
      axios
        .post(
          `${apiBaseUrl}/verify`,
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setUser(res.data.user);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
          if (!unprotectedRoutes.includes(pathname)) {
            router.push("/signin");
          }
        });
    }
  }, [pathname]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </UserContext.Provider>
  );
}
