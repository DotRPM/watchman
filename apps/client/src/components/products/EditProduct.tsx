import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dispatch, SetStateAction, useState } from "react";
import ProductEntity from "@/lib/entities/Product";

interface Props {
  product: ProductEntity;
  setProduct: Dispatch<SetStateAction<ProductEntity>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function EditProduct({ open, setOpen, product, setProduct }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const submitProduct = async () => {
    setSubmitting(true);
    await axios.patch(
      `/api/products/${product.id}`,
      {
        ...product,
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
  };

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <div className="flex flex-col gap-3 max-w-[500px] mx-auto px-2 py-10 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="interval">Interval (hours)</label>
              <Input
                min={1}
                step={1}
                id="interval"
                type="number"
                value={product.interval}
                onChange={(e) =>
                  setProduct({ ...product, interval: Number(e.target.value) })
                }
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
                value={product.threshold}
                onChange={(e) =>
                  setProduct({ ...product, threshold: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="w-full"
              onClick={() => setOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={submitting || !product.threshold || !product.interval}
              onClick={submitProduct}
            >
              {submitting && (
                <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default EditProduct;
