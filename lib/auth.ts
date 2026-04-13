import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import db from "@/lib/db"; // Replace with your actual DB import

export const auth = betterAuth({
    database: db,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false, // Prevents frontend from setting the role via signup
                required: false,
                defaultValue: "pending",
            },
        },
    },
    plugins: [
        admin(), // Required for the role-based logic
    ],
});