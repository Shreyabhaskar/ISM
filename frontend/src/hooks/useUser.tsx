import { useContext } from "react";
import { UserContext } from "@/components/auth/AuthProvider";

export default function useUser() {
  let userContext = useContext(UserContext);
  return [userContext.user, userContext.setUser];
}
