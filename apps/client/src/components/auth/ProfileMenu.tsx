import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
  AiOutlineSun,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineMoon,
} from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";
import { useAuthContext } from "@/components/hooks/useAuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Props {
  openLoginDrawer: () => void;
  openProfileDrawer: () => void;
}

function ProfileMenu({ openLoginDrawer, openProfileDrawer }: Props) {
  const [dark, setDark] = useState(false);
  const { authenticated, setAuthenticated, setUser } = useAuthContext();

  const handleSignout = async () => {
    await axios.post("/api/auth/signout", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setAuthenticated(false);
    setUser({
      firstName: "Unknown",
      lastName: "User",
      email: "mrunknown@watchman.com",
      id: "",
      createdAt: new Date(),
      _count: {
        products: 0,
      },
    });
  };

  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="outline">
          <RiUserLine className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {authenticated ? (
          <DropdownMenuItem
            className="flex items-center gap-2 text-secondary-foreground"
            onClick={openProfileDrawer}
          >
            <AiOutlineUser />
            Profile
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2 text-secondary-foreground"
            onClick={openLoginDrawer}
          >
            <AiOutlineUser />
            Sign in
          </DropdownMenuItem>
        )}
        {dark ? (
          <DropdownMenuItem
            className="flex items-center gap-2 text-secondary-foreground"
            onClick={() => setDark((state) => !state)}
          >
            <AiOutlineSun />
            Light mode
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2 text-secondary-foreground"
            onClick={() => setDark((state) => !state)}
          >
            <AiOutlineMoon />
            Dark mode
          </DropdownMenuItem>
        )}
        {authenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-secondary-foreground"
              onClick={handleSignout}
            >
              <AiOutlineLogout />
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
