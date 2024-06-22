import axios from "axios";
import { truncate } from "@/lib/general";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DetailsEntity } from "@/lib/entities/Details";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  link: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleProductAdded: () => void;
}

function NewProduct({ link, open, setOpen, handleProductAdded }: Props) {
  const [interval, setInterval] = useState(1);
  // set default threshold value to price - 10%
  const [threshold, setThreshold] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<DetailsEntity | null>(null);

  const fetchProduct = async () => {
    setFetching(true);
    const { data } = await axios.get(`/api/products/details?url=${link}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setProduct(data);
    setFetching(false);
  };

  const submitProduct = async () => {
    setSubmitting(true);
    await axios.post(
      `/api/products`,
      {
        ...product,
        url: link,
        interval,
        threshold,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setOpen(false);
    setSubmitting(false);
    handleProductAdded();
  };

  useEffect(() => {
    if (open) fetchProduct();
  }, [open]);

  useEffect(() => {
    if (product)
      setThreshold(product.price - Math.round((product.price * 5) / 100));
  }, [product]);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        {!fetching && product ? (
          <div className="flex flex-col gap-3 max-w-[500px] mx-auto px-2 py-10 w-full">
            <div className="flex items-center gap-3 py-2">
              <img
                className="w-20 h-20 object-contain rounded-md border border-input bg-muted"
                src={product.image}
              />
              <div className="flex flex-col gap-1">
                <p
                  dangerouslySetInnerHTML={{
                    __html: truncate(product.title, 80),
                  }}
                  className="text-secondary-foreground"
                ></p>
                <h1 className="font-bold text-lg text-secondary-foreground">
                  {product.currency} {product.price}
                </h1>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="interval">Interval (hours)</label>
                <Input
                  min={1}
                  step={1}
                  id="interval"
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="threshold">
                  Expected price ({product.currency})
                </label>
                <Input
                  min={1}
                  step={1}
                  id="threshold"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  setProduct(null);
                  setOpen(false);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                disabled={submitting || !threshold || !interval}
                onClick={submitProduct}
              >
                {submitting && (
                  <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add to Watchlist
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col py-10 items-center justify-center">
            <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default NewProduct;
