import axios from "axios";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncate } from "@/lib/general";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { MdOutlineDelete } from "react-icons/md";
import ProductEntity from "@/lib/entities/Product";
import { Separator } from "@/components/ui/separator";
import EditProduct from "./EditProduct";

interface Props {
  product: ProductEntity;
}

function ProductCard({ product }: Props) {
  const [deleted, setDeleted] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [productData, setProductData] = useState(product);

  const deleteProduct = async () => {
    await axios.delete(`/api/products/${product.id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setDeleted(true);
  };

  if (deleted) return;

  return (
    <Card className="flex flex-col items-start gap-3 p-4">
      <EditProduct
        open={editProduct}
        setOpen={setEditProduct}
        product={productData}
        setProduct={setProductData}
      />
      <div className="flex items-center gap-3">
        <img
          className="w-20 h-20 object-contain rounded-md border border-input bg-muted"
          src={productData.image}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <a
              dangerouslySetInnerHTML={{
                __html: truncate(productData.title, 80),
              }}
              className="font-semibold text-secondary-foreground hover:underline"
              href={productData.url}
            ></a>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="px-1">
                  <FiMoreVertical className="w-5 h-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => setEditProduct(true)}
                >
                  <AiOutlineEdit />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={deleteProduct}
                >
                  <MdOutlineDelete />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-secondary-foreground">
              {productData.currency} {productData.price}
            </h1>
            <BsArrowRight className="text-primary" />
            <h1 className="font-bold text-lg text-primary">
              {productData.currency}{" "}
              {productData.updates[0] || productData.price}
            </h1>
            <Badge>
              {(
                Math.abs(
                  ((productData.updates[0] || productData.price) /
                    productData.price) *
                    100
                ) - 100
              ).toFixed(2)}{" "}
              %
            </Badge>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex items-stretch w-full">
        <div className="flex items-center gap-2 w-full text-sm text-muted-foreground justify-center">
          <p>{new URL(productData.url).host}</p>
          <Separator orientation="vertical" />
          <p>
            {new Date(productData.createdAt).toLocaleDateString("en", {
              dateStyle: "medium",
            })}
          </p>
          <Separator orientation="vertical" />
          <p>Every {productData.interval} hour(s)</p>
          <Separator orientation="vertical" />
          <p>
            Expected: {productData.currency} {productData.threshold}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
