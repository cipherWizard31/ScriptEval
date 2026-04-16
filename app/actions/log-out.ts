'use client'

import { authClient } from "@/lib/auth-client";

export default async function LogOutFunction(router: any) {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.refresh();
                router.push("/login");
            },
        },
    });
}

