import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginDrawer from "@/components/auth/LoginDrawer";
import ProfileMenu from "@/components/auth/ProfileMenu";
import NewProduct from "@/components/products/NewProduct";
import ProfileDrawer from "@/components/auth/ProfileDrawer";
import { useAuthContext } from "@/components/hooks/useAuthContext";

import axios from "axios";
import { useEffect, useState } from "react";
import { SiRedhat } from "react-icons/si";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductEntity from "@/lib/entities/Product";
import ProductCard from "@/components/products/ProductCard";

function HomePage() {
  const { authenticated, user } = useAuthContext();
  const [link, setLink] = useState("");
  const [fetching, setFetching] = useState(false);
  const [newProductDrawer, setNewProductDrawer] = useState(false);
  const [loginDrawer, setLoginDrawer] = useState(false);
  const [profileDrawer, setProfileDrawer] = useState(false);
  const [products, setProducts] = useState<ProductEntity[]>([]);

  const fetchProducts = async () => {
    setFetching(true);
    const { data } = await axios.get(`/api/products`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setProducts(data);
    setFetching(false);
  };

  useEffect(() => {
    fetchProducts();
    if (authenticated && (!user.firstName || !user.lastName))
      setProfileDrawer(true);
  }, [authenticated]);

  return (
    <div className="min-h-[100vh] flex items-start justify-center py-10 px-2 bg-white dark:bg-zinc-900">
      {/* drawers */}
      <NewProduct
        link={link}
        open={newProductDrawer}
        setOpen={setNewProductDrawer}
        handleProductAdded={() => {
          fetchProducts();
          setLink("");
        }}
      />
      <LoginDrawer open={loginDrawer} setOpen={setLoginDrawer} />
      <ProfileDrawer open={profileDrawer} setOpen={setProfileDrawer} />
      {/* drawers end */}

      <div className="flex flex-col gap-6 max-w-[500px] w-full">
        {/* header */}
        <div className="flex justify-between items-center">
          {/* title */}
          <div className="flex items-center gap-1">
            <SiRedhat className="text-foreground w-6 h-6" />
            <h1 className="text-primary font-bold text-lg">Watchman</h1>
          </div>

          <ProfileMenu
            openLoginDrawer={() => setLoginDrawer(true)}
            openProfileDrawer={() => setProfileDrawer(true)}
          />
        </div>
        {/* header ends */}

        {/* search */}
        <div className="flex w-full items-stretch gap-2">
          <Input
            placeholder="Paste product link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Button
            onClick={() => setNewProductDrawer(true)}
            disabled={fetching || !link.trim()}
          >
            Search
          </Button>
        </div>
        {/* search ends */}

        <div className="flex flex-col gap-2 h-full flex-1">
          <div className="flex items-center justify-between w-full">
            <h3>Watchlist</h3>
            <p className="text-sm">{products.length} product(s)</p>
          </div>
          {fetching && (
            <div className="w-full flex items-center justify-center p-10">
              <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {!fetching &&
            products.map((product) => <ProductCard product={product} />)}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
