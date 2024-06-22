import axios, { AxiosError } from "axios";
import UserEntity from "@/lib/entities/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../hooks/useAuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function LoginDrawer({ open, setOpen }: Props) {
  const { setUser, setAuthenticated } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [tempUser, setTempUser] = useState<UserEntity | null>(null);

  const submitEmail = async () => {
    setFetching(true);
    try {
      const { data } = await axios.post(
        "/api/auth/signin",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setTempUser(data);
      setError("");
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      }
    }
    setFetching(false);
  };

  const verifyEmail = async () => {
    if (!tempUser) return;
    setFetching(true);
    try {
      await axios.post(
        "/api/auth/verify",
        {
          otp: Number(otp),
          userId: tempUser.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(tempUser);
      setAuthenticated(true);
      setOpen(false);
      setError("");
      resetDefaults();
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      }
    }
    setFetching(false);
  };

  const resetDefaults = () => {
    setTempUser(null);
    setEmail("");
    setOtp("");
  };

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        {tempUser?.id ? (
          <div className="flex flex-col gap-3 max-w-[500px] mx-auto px-2 py-10 w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-lg font-bold">
                Verify email address
              </h1>
              <p className="text-muted-foreground">
                Please enter the OTP you've received in your email address.
              </p>
            </div>
            {error && <p className="text-destructive">{error}</p>}
            <Input
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={fetching}
              onClick={verifyEmail}
            >
              {fetching && (
                <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-[500px] mx-auto px-2 py-10 w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-lg font-bold">Login</h1>
              <p className="text-muted-foreground">
                Please login to watchman to access the features.
              </p>
            </div>
            {error && <p className="text-destructive">{error}</p>}
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={fetching}
              onClick={submitEmail}
            >
              {fetching && (
                <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
              )}
              Send OTP
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default LoginDrawer;
