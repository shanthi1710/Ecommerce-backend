import {z} from "zod";

export const cartItemSchema = z.object({
   productId:z.number(),
   quantity:z.number()
}); 

export const changeQuantitySchema = z.object({
   quantity:z.number()
})