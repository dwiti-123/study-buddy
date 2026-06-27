import {z} from "zod";

export  const registerSchema = z.object({
name:z.string().min(2,"Name must be atleast 2 character long"),
email:z.email("Invalid Email formate"),
password:z.string().min(4,"Password need to be minimum of 4 length").max(12,"password cannot be longer than 12 character"),
});


export const loginSchema = z.object({
    email:z.email("Invalid Email formate"),
    password:z.string().min(4,"Password need to be minimum of 4 length").max(12,"Password cannot be longet than 12 character"),
});
