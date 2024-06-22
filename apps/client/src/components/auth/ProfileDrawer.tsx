import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../hooks/useAuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function ProfileDrawer({ open, setOpen }: Props) {
  const { user, setUser } = useAuthContext();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [fetching, setFetching] = useState(false);

  const submitUser = async () => {
    setFetching(true);
    const { data } = await axios.patch(
      "/api/users",
      {
        firstName,
        lastName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    setUser(data);
    setFetching(false);
  };

  const closeDrawer = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setOpen(false);
  };

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  return (
    <Drawer open={open} onClose={closeDrawer}>
      <DrawerContent>
        <div className="flex flex-col gap-3 max-w-[500px] mx-auto px-2 py-10 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-lg font-bold">Profile</h1>
            <p
              className={`${!firstName || !lastName ? "text-primary" : "text-muted-foreground"}`}
            >
              {!firstName || !lastName
                ? "Please update your first and last names."
                : "You can update your profile details here."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input placeholder="Enter your OTP" value={user.email} disabled />
          <div className="flex items-center gap-2">
            <Button
              className="w-full"
              onClick={closeDrawer}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={fetching || !firstName || !lastName}
              onClick={submitUser}
            >
              {fetching && (
                <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileDrawer;
